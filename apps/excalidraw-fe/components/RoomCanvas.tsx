"use client";
import Canvas from "./canvas";
import { useWebSocket } from "@/hooks/useWebSocket";
import Chat from "./chat";
import { useEffect } from "react";
import { Wifi } from "lucide-react";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const { socket, status, sendMessage, subscribe } = useWebSocket();

  useEffect(() => {
    if (!socket) return;
    const data = JSON.stringify({
      type: "join_room",
      roomId,
    });
    sendMessage(data);
  }, [sendMessage, roomId, socket]);

  if (status === "connecting" || socket === null) {
    return (
      <div className="pixel-canvas-shell grid min-h-screen place-items-center px-5">
        <div className="pixel-panel-strong flex items-center gap-3 p-5 font-mono text-sm font-black uppercase text-[var(--pixel-yellow)]">
          <Wifi className="h-5 w-5 animate-pulse text-[var(--pixel-cyan)]" />
          Connecting to server
        </div>
      </div>
    );
  }

  return (
    <div className="pixel-canvas-shell fixed inset-0 overflow-hidden">
      <Canvas
        sendMessage={sendMessage}
        subscribe={subscribe}
        roomId={roomId}
      ></Canvas>
      <Chat sendMessage={sendMessage} subscribe={subscribe} roomId={roomId} />
    </div>
  );
};

export default RoomCanvas;
