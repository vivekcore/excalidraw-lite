import { WebSocket } from "ws";
export interface IncomingMessage {
  type:
    | "auth"
    | "join_room"
    | "leave_room"
    | "chat"
    | "shape:create"
    | "shape:update"
    | "shape:delete";
  [key: string]: unknown;
}

export interface Connection {
  ws: WebSocket;
  userId: string;
  rooms: Set<string>; 
  connectedAt: number;
}