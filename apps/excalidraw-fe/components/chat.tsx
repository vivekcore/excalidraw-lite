import { Listener } from "@/hooks/useWebSocket";
import React, { useEffect, useRef, useState } from "react";

const Chat = ({
  subscribe,
  sendMessage,
  roomId,
}: {
  subscribe: (topic: string, fn: Listener) => void;
  sendMessage: (data: string) => void;
  roomId: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ServerRes, setServerRes] = useState<string[]>([]);
  useEffect(() => {
    const unsub = subscribe("chat", (data) => {
      setServerRes(prev => [...prev, data.message])
    });
    return unsub
  }, [subscribe]);

  const handleMessage = () => {
    const message = inputRef.current?.value.trim();
    const data = {
      type: "chat",
      message: message,
      roomId,
    };
    sendMessage(JSON.stringify(data));
  };
  return (
    <div className="h-200 w-100 bg-white text-black">
     <div>
        {ServerRes.map((data, index) => (
          <div key={index}>{data}</div>
        ))}
      </div> 
      <input ref={inputRef} type="text" placeholder="Enter Your Message" />
      <button onClick={handleMessage}>Send</button>
    </div>
  );
};

export default Chat;
