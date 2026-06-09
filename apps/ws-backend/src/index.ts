import jwt, { JwtPayload } from "jsonwebtoken";
import WebSocket, { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/prisma";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  room: string[];
  userId: string;
}
let users: User[] = [];
const checkUser = (token: string): string | null => {
  try {
    const decode = jwt.verify(token, JWT_SECRET);

    if (typeof decode == "string") {
      return null;
    }
    if (!decode || !decode.userId) {
      return null;
    }
    return decode.userId;
  } catch (error) {
    console.log("url missing");
    return null;
  }
};

wss.on("connection", function connection(ws, request) {
  ws.on("error", console.error);
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);

  if (!userId || userId === null) {
    ws.close();
    return;
  }

  const existing = users.filter((u) => u.userId === userId);
  existing.forEach((u) => u.ws.close());
  users = users.filter((u) => u.userId !== userId);

  users.push({
    ws,
    userId,
    room: [],
  });

  ws.on("close", () => {
    users = users.filter((u) => u.ws !== ws);
  });

  ws.on("message", async (data) => {
    try {
      const parseData = JSON.parse(data as unknown as string);
      if (parseData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        user?.room.push(parseData.roomId);
      }

      if (parseData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        user.room = user.room.filter((x) => x !== parseData.roomId);
      }

      if (parseData.type === "chat") {
        const roomId = Number(parseData.roomId);
        const message = parseData.message;
        
        await prisma.chat.create({
          data: {
            message,
            roomId,
            userId,
          },
        });
        users.forEach((user) => {
          if (user.room.includes(parseData.roomId) && ws !== user.ws) {// 
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: message,
                roomId,
              }),
            );
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
});
