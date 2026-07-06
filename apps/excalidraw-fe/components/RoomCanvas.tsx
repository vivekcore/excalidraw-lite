"use client";
import Canvas from "./canvas";
import { useWebSocket } from "@/hooks/useWebSocket";
import Chat from "./chat";

const RoomCanvas = ({ roomId }: { roomId: string }) => {
  const { socket, status,sendMessage,subscribe } = useWebSocket();

  if (status === "connecting" || socket === null) {
    return <div>Connecting to server</div>;
  }

  return (
    <>
      <Canvas sendMessage={sendMessage} subscribe={subscribe}  socket={socket} roomId={roomId}></Canvas>
      <Chat sendMessage={sendMessage} subscribe={subscribe} roomId={roomId}></Chat>
    </>
  );
};

export default RoomCanvas;
