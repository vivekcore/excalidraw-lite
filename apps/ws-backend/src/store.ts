import { Connection } from "./types";
import { WebSocket } from "ws";

class ConnectionStore {
    private byWs = new Map<WebSocket, Connection>()
    private byRoom = new Map<string, Set<WebSocket>>();

    add(ws: WebSocket, userId: string) {
        this.byWs.set(ws, { ws, userId, rooms: new Set(), connectedAt: Date.now() })
    }

    leaveRoom(ws: WebSocket, roomId: string) {
        const conn = this.byWs.get(ws)
        conn?.rooms.delete(roomId)
        const room = this.byRoom.get(roomId)
        if (room) {
            room.delete(ws)
            if (room.size === 0) this.byRoom.delete(roomId)
        }
    }

    joinRoom(ws: WebSocket, roomId: string) {
        const conn = this.byWs.get(ws)
        conn?.rooms.add(roomId)
        const room = this.byRoom.get(roomId) ?? new Set()
        room.add(ws)
        this.byRoom.set(roomId, room)
    }

    getByRoom(roomId: string) {
        const sockets = this.byRoom.get(roomId) ?? new Set()
        return [...sockets].map(ws => this.byWs.get(ws)!).filter(Boolean)
    }

    remove(ws: WebSocket) {
        const conn = this.byWs.get(ws)
        if (conn) {
            for (const roomId of conn.rooms) {
                const room = this.byRoom.get(roomId)
                if (room) {
                    room.delete(ws)
                    if (room.size === 0) this.byRoom.delete(roomId)
                }
            }
        }
        this.byWs.delete(ws)
    }

    get(ws: WebSocket) {
        return this.byWs.get(ws)
    }
}

export const connectionStore = new ConnectionStore()