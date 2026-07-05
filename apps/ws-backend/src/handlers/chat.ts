import { prisma } from "@repo/db";
import { broadcastToRoom } from "../utils/broadcast";
import { connectionStore } from "../store";
import { WebSocket } from "ws";

export async function HandleChat(ws: WebSocket, msg: any) {
  try {
    const conn = connectionStore.get(ws)
    if (!conn) return
    const roomId = Number(msg.roomId)
    if (!msg.message || !roomId) return

    await prisma.chat.create({
      data: {
        type: "text",
        message: msg.message,
        userId: conn.userId,
        roomId,
      },
    })
    broadcastToRoom(String(roomId), { type: "chat", message: msg.message, userId: conn.userId }, ws)
  } catch (error) {
    console.error("chat error:", error)
  }
}
