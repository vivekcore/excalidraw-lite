import { BACKEND_URL } from "@/config";
import { Listener } from "@/hooks/useWebSocket";
import { api } from "@/lib/axios";
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
interface message {
  userId: string;
  message: string;
}

const Chat = ({
  subscribe,
  sendMessage,
  roomId,
}: {
  subscribe: (topic: string, fn: Listener) => () => void;
  sendMessage: (data: string) => void;
  roomId: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
<<<<<<< HEAD
  const [ServerRes, setServerRes] = useState<string[]>([]);
  const [chats, setchats] = useState<Set<message>>(new Set());
=======
  const [ServerRes, setServerRes] = useState<Set<message>>(new Set());

>>>>>>> 2caf724fe31e6ef57265fd129fdd471efda94d14
  const LogedUser = localStorage.getItem("userId") as string;
  useEffect(() => {
    const FetchChats = async () => {
      const chats = await api.get(`${BACKEND_URL}/room/chats/${roomId}`);
      const data = chats.data.data as [];
      data.forEach((val: message) => {
<<<<<<< HEAD
        setchats((prev) =>
=======
        setServerRes((prev) =>
>>>>>>> 2caf724fe31e6ef57265fd129fdd471efda94d14
          new Set(prev).add({ userId: val.userId, message: val.message }),
        );
      });
    };
    FetchChats();
  }, [roomId]);

  useEffect(() => {
    const unsub = subscribe("chat", (data) => {
<<<<<<< HEAD
      setServerRes((prev) => [...prev, JSON.stringify(data.message)]);
=======
      setServerRes((prev) =>
          new Set(prev).add({ userId: data.userId as string, message: data.message as string }),
        );
>>>>>>> 2caf724fe31e6ef57265fd129fdd471efda94d14
    });
    return unsub;
  }, [subscribe]);

  const handleMessage = () => {
    if(!inputRef.current) return
    const message = inputRef.current?.value.trim();
    inputRef.current.value = ""    

    const data = {
      type: "chat",
      message: message,
      roomId,
    };
    sendMessage(JSON.stringify(data));
<<<<<<< HEAD
    setchats((prev) =>
      new Set(prev).add({ userId: LogedUser, message: message }),
    );
=======
      setServerRes((prev) =>
          new Set(prev).add({ userId: LogedUser, message, }),
        )
  
>>>>>>> 2caf724fe31e6ef57265fd129fdd471efda94d14
    
  };
  return (
    <aside className="pixel-panel fixed bottom-4 right-4 z-50 flex max-h-[42vh] w-[calc(100vw-2rem)] flex-col p-3 sm:bottom-6 sm:right-6 sm:max-h-[52vh] sm:w-80">
      <div className="mb-3 flex items-center justify-between border-b-2 border-(--pixel-line) pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-(--pixel-cyan)" />
          <span className="font-mono text-xs font-black uppercase text-(--pixel-yellow)">
            Room chat
          </span>
        </div>
        <span className="font-mono text-[10px] font-black uppercase text-(--pixel-muted)">
          #{roomId}
        </span>
      </div>

      <div className="min-h-24 flex-1 space-y-2 overflow-y-auto pr-1">
<<<<<<< HEAD
        {chats.size === 0 ? (
          <div className="border-2 border-dashed border-(--pixel-line) bg-[#0f1320] p-3 font-mono text-xs font-bold uppercase text-(--pixel-muted)">
            No messages
          </div>
        ) : (
          <ul>
            {[...chats.values()].map((val, idx) => (
              <li key={idx}>{val.message}</li>
            ))}
          </ul>
        )}
        {ServerRes.length === 0 ? (
          <div></div>
        ) : (
          ServerRes.map((data, index) => (
=======
        {ServerRes.size === 0 ? (
          <div></div>
        ) : (
          [...ServerRes.values()].map((data, index) => (
>>>>>>> 2caf724fe31e6ef57265fd129fdd471efda94d14
            <div
              className="border-2 border-(--pixel-line) bg-[#0f1320] px-3 py-2 text-sm text-(--pixel-text) shadow-[3px_3px_0_var(--pixel-ink)]"
              key={index}
            >
<<<<<<< HEAD
              {data}
=======
              {data.message}
>>>>>>> 2caf724fe31e6ef57265fd129fdd471efda94d14
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="pixel-input min-w-0 px-3 py-2 text-sm"
          ref={inputRef}
          type="text"
          placeholder="Enter message"
        />
        <button
          className="pixel-button pixel-button-primary shrink-0 px-3 py-2"
          onClick={handleMessage}
          aria-label="Send message"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default Chat;
