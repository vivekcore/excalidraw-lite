import { useEffect, useState, useRef } from "react";
import { WS_URL } from "../config";

interface UseWebSocketProps {
  roomId: number | undefined;
  onChatMessage: (payload: { message: string; userId: string; userName: string }) => void;
}

export const useWebSocket = ({ roomId, onChatMessage }: UseWebSocketProps) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const onChatMessageRef = useRef(onChatMessage);

  // Keep ref up to date with the latest handler callback without re-triggering connection
  useEffect(() => {
    onChatMessageRef.current = onChatMessage;
  }, [onChatMessage]);

  useEffect(() => {
    if (!roomId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setStatus("connecting");
    const socket = new WebSocket(`${WS_URL}?token=${token}`);

    socket.onopen = () => {
      setStatus("connected");
      // Join Room
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "chat" && payload.roomId === roomId) {
          onChatMessageRef.current({
            message: payload.message,
            userId: payload.userId,
            userName: payload.userName || "Participant",
          });
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    socket.onclose = () => {
      setStatus("disconnected");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setStatus("disconnected");
    };

    setWs(socket);

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [roomId]); // Reconnect only if roomId changes

  const sendMessage = (message: string) => {
    if (ws && status === "connected" && roomId) {
      ws.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message,
        })
      );
    }
  };

  return { sendMessage, status };
};
