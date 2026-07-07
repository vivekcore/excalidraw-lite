"use client";
import Canvas from "./canvas";
import { useWebSocket } from "@/hooks/useWebSocket";
import Chat from "./chat";
import { useEffect } from "react";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const { socket, status, sendMessage, subscribe } = useWebSocket();

  useEffect(() => {
    if(!socket) return
    const data = JSON.stringify({
      type: "join_room",
      roomId,
    });
    sendMessage(data);
  }, [sendMessage, roomId,socket]);

  if (status === "connecting" || socket === null) {
    return <div>Connecting to server</div>;
  }

  return (
    <>
      <Canvas
        sendMessage={sendMessage}
        subscribe={subscribe}
        roomId={roomId}
      ></Canvas>
      <Chat 

        sendMessage={sendMessage}
        subscribe={subscribe}
        roomId={roomId}
        
      ></Chat>
    </>
  );
};

export default RoomCanvas;
