import { prisma } from "@repo/db";
import { broadcastToRoom } from "../utils/broadcast";
import { connectionStore } from "../store";
import { WebSocket } from "ws";
import { mainQueue } from "../config/Queue";

export async function HandleChat(ws: WebSocket, msg: any) {
  try {
    const conn = connectionStore.get(ws)
    if (!conn) return
    const roomId = Number( msg.roomId)
    if (!msg.message || !roomId) return
    const data = {
      type:'text',
      message: msg.message,
      userId: conn.userId,
      roomId,
    }
    const res = await mainQueue.add('save-chat',data, {
      attempts:3,
      backoff:{type:'exponential',delay:500},
      removeOnComplete:true,
      removeOnFail:false
    })
    broadcastToRoom(String(roomId), { type: "chat", message: res.data.message, userId: conn.userId }, ws)
  } catch (error) {
    console.error("chat error:", error)
  }
}
