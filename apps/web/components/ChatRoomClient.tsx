"use client"
import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSockets";

const ChatRoomClient = ({
  messages,
  id,
}: {
  messages: { message: string, id: number }[];
  id: string;
}) => {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();
  const [cMessage, setCmessage] = useState<string>();

  useEffect(() => {
    setChats(messages);
  }, [messages]);

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        }),
      );
      socket.onmessage = (event) => {
        const parseData = JSON.parse(event.data);
        if (parseData.type === "chat") {
          setChats((c) => [...c, { message: parseData.message, id: Date.now() }]);
        }
      };
    }
  }, [socket, loading, id]);
  console.log(chats)
  return (
    <div>
      {chats.map((m) => (
        <div key={m.id}>{m.message}</div>
      ))}
      <input
        type="text"
        value={cMessage}
        onChange={(e) => {
          setCmessage(e.target.value);
        }}
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: cMessage,
            }),
          );
        }}
      >send</button>
    </div>
  );
};

export default ChatRoomClient;
