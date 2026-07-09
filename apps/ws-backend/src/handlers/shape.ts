import { broadcastToRoom } from "../utils/broadcast";
import { connectionStore } from "../store";
import { WebSocket } from "ws";
import { mainQueue } from "../config/Queue";
export const ShapeHandler = {
  createShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws);
      if (!conn) return;
      const roomId = Number(msg.roomId);
      if (!msg.shape || !roomId) return;

      const data = {
        roomId,
        userId: conn.userId,
        data: msg.shape,
      };
      const res = await mainQueue.add("create-shape", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 500 },
        removeOnComplete: true,
        removeOnFail: false,
      });

      broadcastToRoom(
        String(res.data.roomId),
        { type: "shape:create", shape: res.data.shape },
        ws,
      );
    } catch (error) {
      console.error("shape:create error:", error);
    }
  },

  updateShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws);
      if (!conn || !msg.shapeId || !msg.shape) return;

      const data = {
        id: msg.shapeId,
        shape: msg.shape,
        roomId: Number(msg.roomId),
      };
      const res = await mainQueue.add("update-shape", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 500 },
        removeOnComplete: true,
        removeOnFail: false,
      });

      broadcastToRoom(
        String(res.data.roomId),
        { type: "shape:update", shapeId: res.data.id, shape: res.data.shape },
        ws,
      );
    } catch (error) {
      console.error("shape:update error:", error);
    }
  },

  deleteShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws);
      if (!conn || !msg.shapeId) return;

      const data = {
        id: msg.shapeId,
        roomId: Number(msg.roomId),
      };
      const res = await mainQueue.add("delete-shape", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 500 },
        removeOnComplete: true,
        removeOnFail: false,
      });
      broadcastToRoom(
        String(res.data.roomId),
        { type: "shape:delete", shapeId: res.data.id },
        ws,
      );
    } catch (error) {
      console.error("shape:delete error:", error);
    }
  },
};
