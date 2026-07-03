"use client";
import { useEffect, useState } from "react";
import Canvas from "./canvas";
import { WS_URL } from "@/config";
import { getToken } from "@/utils/token";
import { useRouter } from "next/navigation";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const token = getToken();
  const router = useRouter();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!token || token === "undefined") {
      router.push("./sign-in");
      return;
    }
  }, [token, router]);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "auth",
          token: `${token}`
        })
      )
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };
    return () => {
      ws.close();
    };
  }, [roomId, token]);
  if (socket === null) {
    return <div>Connecting to server...</div>;
  }
  return <Canvas roomId={roomId} socket={socket} />;
};

export default RoomCanvas;
