import WebSocket, { WebSocketServer } from "ws";
import { connectionStore } from "./store";
import { HandleAuth } from "./handlers/auth";
import { HandleJoinRoom, HandleLeaveRoom } from "./handlers/room";
import { HandleChat } from "./handlers/chat";
import { ShapeHandler } from "./handlers/shape";
import "./workers/main.worker"
const wss = new WebSocketServer({ port: 8080 });

const handlers: Record<string, (ws: WebSocket, msg: any) => Promise<void> | void> = {
  auth: HandleAuth,
  join_room: HandleJoinRoom,
  leave_room: HandleLeaveRoom,
  chat: HandleChat,
  "shape:create": ShapeHandler.createShape,
  "shape:update": ShapeHandler.updateShape,
  "shape:delete": ShapeHandler.deleteShape,
};

wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("close", () => {
    connectionStore.remove(ws)
  });

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString())

      const handler = handlers[msg.type]
      if (!handler) {
        ws.send(JSON.stringify({ type: "error", message: `Unknown type: ${msg.type}` }))
        return
      }
      await handler(ws, msg)
    } catch (error) {
      console.error("ws message error:", error)
      ws.send(JSON.stringify({ type: "error", message: "Invalid message" }))
    }
  })
})

