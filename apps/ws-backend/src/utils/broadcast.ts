import { connectionStore } from "../store";
import { WebSocket } from "ws";

export function broadcastToRoom(roomId: string, message: object, excludeSender?: WebSocket) {
    const connections = connectionStore.getByRoom(roomId)
    for (const conn of connections) {
        if (conn.ws !== excludeSender) {
            conn.ws.send(JSON.stringify(message))
        }
    }
}

export function broadcastToAll(roomId: string, message: object) {
    const connections = connectionStore.getByRoom(roomId)
    for (const conn of connections) {
        conn.ws.send(JSON.stringify(message))
    }
}