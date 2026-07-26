import { broadcastToAll, broadcastToRoom } from "../utils/broadcast";
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
      const shape = JSON.parse(msg.shape);
      const data = {
        roomId,
        userId: conn.userId,
        data: shape,
        shapeId: shape.id,
      };
      await mainQueue.add("create-shape", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 500 },
        removeOnComplete: true,
        removeOnFail: false,
      });

      broadcastToRoom(
        String(msg.roomId),
        { type: "shape:create", shape: msg.shape },
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
        shapeId: msg.shape.id,
        shape: msg.shape,
        roomId: Number(msg.roomId),
      };
      await mainQueue.add("update-shape", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 500 },
        removeOnComplete: true,
        removeOnFail: false,
      });

      broadcastToRoom(
        String(msg.roomId),
        { type: "shape:update", shape: msg.shape },
        ws,
      );
    } catch (error) {
      console.error("shape:update error:", error);
    }
  },

  deleteShape: async (ws: WebSocket, msg: any) => {
    try {
      const conn = connectionStore.get(ws);
      const shape = msg.shape;
      if (!conn || !shape.id) return;
      const data = {
        shapeId: shape.id,
        roomId: Number(msg.roomId),
      };
      await mainQueue.add("delete-shape", data, {
        attempts: 3,
        backoff: { type: "exponential", delay: 500 },
        removeOnComplete: true,
        removeOnFail: false,
      });
      broadcastToRoom(
        String(msg.roomId),
        { type: "shape:delete", shapeId: msg.shape.id },
        ws,
      );
    } catch (error) {
      console.error("shape:delete error:", error);
    }
  },
  deleteAll: async (ws: WebSocket, msg: any) => {
    const conn = connectionStore.get(ws);
    const data = {
      roomId: msg.roomId,
      adminId: conn?.userId,
    };
    await mainQueue.add("deleteAll", data, {
      attempts: 3,
      backoff: { type: "exponential", delay: 500 },
      removeOnComplete: true,
      removeOnFail: false,
    });

    broadcastToAll(String(msg.roomId), {
      type: "shape:deleteAll",
      status: "Canvas cleared",
    });
  },
  freehand: (ws: WebSocket, msg: any) => {
    const conn = connectionStore.get(ws);
    if (!conn) return;
    const shape = JSON.parse(msg.shape);
    console.log(shape);
    broadcastToRoom(
      String(msg.roomId),
      {
        type: "shape:freehand",
        shape: shape,
      },
      ws,
    );
  },
};
