import { WS_URL } from "@/config";
import { getToken } from "@/utils/token";
import { useCallback, useEffect, useRef, useState } from "react";

export type Listener = (data: unknown) => void;
export const useWebSocket = () => {
  const [status, setStatus] = useState<"connecting" | "open" | "closed">(
    "connecting",
  );
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const listnerRef = useRef<Map<string, Set<Listener>>>(new Map());
  const token = getToken();

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("open");
      setSocket(ws);
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "error") {
        console.log(response.message);
        return;
      }

      const topicListeners = listnerRef.current.get(response.type);
      topicListeners?.forEach((fn) => fn(response));
    };

    ws.onclose = () => {
      setStatus("closed");
      setSocket(null);
    };

    return ws;
  }, [token]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws.close();
    };
  }, [connect]);

  const sendMessage = useCallback((data: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    } else {
      console.warn("WebSocket is not open. Message not sent:", data);
    }
  }, []);

  const subscribe = useCallback((topic: string, fn: Listener) => {
    if (!listnerRef.current.has(topic)) {
      listnerRef.current.set(topic, new Set());
    }
    listnerRef.current.get(topic)!.add(fn);
    return () => {
      listnerRef.current.get(topic)!.delete(fn);
    };
  }, []);

  return { socket, status, sendMessage, subscribe };
};
