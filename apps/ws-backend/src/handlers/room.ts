import { connectionStore } from "../store"
import { WebSocket } from "ws"

export function HandleJoinRoom(ws: WebSocket, msg: any) {
    try {
        const roomId = msg.roomId
        if (!roomId) return
        connectionStore.joinRoom(ws, roomId)
    } catch (error) {
        console.error("join_room error:", error)
    }
}

export function HandleLeaveRoom(ws: WebSocket, msg: any) {
    try {
        const roomId = msg.roomId
        if (!roomId) return
        connectionStore.leaveRoom(ws, roomId)
    } catch (error) {
        console.error("leave_room error:", error)
    }
}