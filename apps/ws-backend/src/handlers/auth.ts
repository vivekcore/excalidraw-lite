import Jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/EnvVaribles";
import { connectionStore } from "../store";
import WebSocket from "ws";

export function HandleAuth(ws: WebSocket, msg: any) {
  try {
    if (connectionStore.get(ws)) {
      ws.send(JSON.stringify({ type: "error", message: "Already authenticated" }))
      return
    }
    const decoded = Jwt.verify(msg.token, JWT_SECRET) as JwtPayload
    if (!decoded || !decoded.userId) {
      ws.close()
      return
    }
    const userId = decoded.userId as string
    connectionStore.add(ws, userId)
    ws.send(JSON.stringify({ type: "auth_success", userId }))
  } catch (error) {
    console.error("auth error:", error)
    ws.close()
  }
}
