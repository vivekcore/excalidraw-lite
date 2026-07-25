"use client";
import Canvas from "./canvas";
import { useWebSocket } from "@/hooks/useWebSocket";
import Chat from "./chat";
import { useEffect, useState } from "react";
import { Wifi, Frown } from "lucide-react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const { socket, status, sendMessage, subscribe } = useWebSocket();
  const router = useRouter();
  const [roomStatus, setRoomStatus] = useState<"loading" | "valid" | "invalid">("loading");

  useEffect(() => {
    async function getRoom() {
      try {
        const response = await api.get(`/room/find/${roomId}`);
        if (response.data.data !== null) {
          localStorage.setItem("adminId", response.data.data.adminId);
          setRoomStatus("valid");
        } else {
          setRoomStatus("invalid");
        }
      } catch {
        setRoomStatus("invalid");
      }
    }

    getRoom();
  }, [roomId]);

  useEffect(() => {
    if (!socket || roomStatus !== "valid") return;
    const data = JSON.stringify({
      type: "join_room",
      roomId,
    });
    sendMessage(data);
  }, [sendMessage, roomId, socket, roomStatus]);

  if (roomStatus === "loading") {
    return (
      <div className="pixel-canvas-shell grid min-h-screen place-items-center px-5">
        <div className="pixel-panel-strong flex items-center gap-3 p-5 font-mono text-sm font-black uppercase text-(--pixel-yellow)">
          <Wifi className="h-5 w-5 animate-pulse text-(--pixel-cyan)" />
          Checking room...
        </div>
      </div>
    );
  }

  if (roomStatus === "invalid") {
    return (
      <div className="pixel-canvas-shell grid min-h-screen place-items-center px-5">
        <div className="pixel-panel-strong flex flex-col items-center gap-4 p-8 font-mono">
          <Frown className="h-12 w-12 text-(--pixel-pink)" />
          <h1 className="text-3xl font-black uppercase text-(--pixel-pink)">404</h1>
          <p className="text-sm text-(--pixel-yellow)">Room not found</p>
          <button
            onClick={() => router.push("/")}
            className="pixel-button mt-2 px-4 py-2 text-xs"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (status === "connecting" || socket === null) {
    return (
      <div className="pixel-canvas-shell grid min-h-screen place-items-center px-5">
        <div className="pixel-panel-strong flex items-center gap-3 p-5 font-mono text-sm font-black uppercase text-(--pixel-yellow)">
          <Wifi className="h-5 w-5 animate-pulse text-(--pixel-cyan)" />
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
