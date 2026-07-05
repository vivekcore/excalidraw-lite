import { prisma } from "@repo/db";
import { broadcastToRoom } from "../utils/broadcast";
import { connectionStore } from "../store";
import { WebSocket } from "ws";

export const ShapeHandler = {
  createShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws)
      if (!conn) return
      const roomId = Number(msg.roomId)
      if (!msg.shape || !roomId) return

      const shape = await prisma.shape.create({
        data: {
          roomId,
          userId: conn.userId,
          data: msg.shape,
        },
      })
      broadcastToRoom(String(roomId), { type: "shape:create", shape }, ws)
    } catch (error) {
      console.error("shape:create error:", error)
    }
  },

  updateShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws)
      if (!conn || !msg.shapeId || !msg.shape) return

      const shape = await prisma.shape.update({
        where: { id: msg.shapeId },
        data: { data: msg.shape },
      })
      const room = await prisma.shape.findUnique({ where: { id: msg.shapeId }, select: { roomId: true } })
      if (room) {
        broadcastToRoom(String(room.roomId), { type: "shape:update", shapeId: msg.shapeId, shape }, ws)
      }
    } catch (error) {
      console.error("shape:update error:", error)
    }
  },

  deleteShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws)
      if (!conn || !msg.shapeId) return

      const shape = await prisma.shape.findUnique({ where: { id: msg.shapeId }, select: { roomId: true } })
      await prisma.shape.delete({ where: { id: msg.shapeId } })
      if (shape) {
        broadcastToRoom(String(shape.roomId), { type: "shape:delete", shapeId: msg.shapeId }, ws)
      }
    } catch (error) {
      console.error("shape:delete error:", error)
    }
  },
}
