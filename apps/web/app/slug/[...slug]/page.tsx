"use client";
import React, { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../utils/axiox";
import { useWebSocket } from "../../../hooks/useWebSocket";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IChatMessage {
  id: number;
  message: string;
  userId: string;
  roomId: number;
  user?: {
    name: string;
  };
}

interface IRoom {
  id: number;
  slug: string;
  name: string;
  adminId: string;
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const roomSlug = resolvedParams.slug?.[0];

  const [room, setRoom] = useState<IRoom | null>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { sendMessage, status: wsStatus } = useWebSocket({
    roomId: room?.id,
    onChatMessage: (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          message: payload.message,
          userId: payload.userId,
          roomId: room?.id || 0,
          user: {
            name: payload.userName,
          },
        },
      ]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    const loadWorkspace = async () => {
      try {
        const roomRes = await api.get(`/room/slug/${roomSlug}`);
        if (
          roomRes.status !== 200 ||
          roomRes.data?.status !== "success" ||
          !roomRes.data?.data
        ) {
          setError("Room not found or access denied.");
          setLoading(false);
          return;
        }

        const roomData: IRoom = roomRes.data.data;
        setRoom(roomData);

        const userRes = await api.get("/user/me");
        if (userRes.status === 200 && userRes.data?.status === "success") {
          setCurrentUser(userRes.data.data);
        } else {
          router.push("/auth/sign-in");
          return;
        }

        const chatsRes = await api.get(`/room/chats/${roomData.id}`);
        if (chatsRes.status === 200 && chatsRes.data?.status === "success") {
          const historicalMessages = [...chatsRes.data.data].reverse();
          setMessages(historicalMessages);
        }
      } catch (err) {
        console.error("Error loading workspace data:", err);
        setError("Failed to load room details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [roomSlug, router]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || wsStatus !== "connected" || !room || !currentUser)
      return;

    sendMessage(inputText.trim());
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        message: inputText.trim(),
        userId: currentUser.id,
        roomId: room.id,
        user: { name: currentUser.name },
      },
    ]);
    setInputText("");
  };

  const handleCopyLink = async () => {
    try {
      const inviteUrl = `${window.location.origin}/slug/${room?.slug}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !room || !currentUser) {
    return (
      <div>
        <div>
          <h3>Connection Failed</h3>
          <p>{error || "Workspace initialization aborted."}</p>
          <button onClick={() => router.push("/room")}>Return to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header>
        <button onClick={() => router.push("/room")}>Leave</button>
        <div>
          <h2>{room.name}</h2>
          <div title={`Status: ${wsStatus}`}>{wsStatus}</div>
        </div>
        <button onClick={handleCopyLink}>
          <span>slug: {room.slug}</span>
          {copied && <span>Copied!</span>}
        </button>
        <div>
          <div>{currentUser.name.charAt(0).toUpperCase()}</div>
          <div>
            <div>{currentUser.name}</div>
            <div>Active</div>
          </div>
        </div>
      </header>

      <main>
        {messages.length === 0 ? (
          <div>
            <div>💬</div>
            <h4>No Messages Yet</h4>
            <p>Welcome to #{room.name}. Send the first message to kick off the discussion!</p>
          </div>
        ) : (
          <div>
            {messages.map((msg, index) => {
              const isMe = msg.userId === currentUser.id;
              return (
                <div key={msg.id || index}>
                  {!isMe && <div>{msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : "?"}</div>}
                  <div>
                    {!isMe && <div>{msg.user?.name || "Participant"}</div>}
                    <div>{msg.message}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}

        <form onSubmit={handleSend}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              wsStatus === "connected"
                ? `Message #${room.name}...`
                : "Reconnecting to workspace..."
            }
            disabled={wsStatus !== "connected"}
          />
          <button type="submit" disabled={wsStatus !== "connected" || !inputText.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Page;
