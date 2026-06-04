"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Room = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === null) {
      router.push("/auth");
      return;
    }
  }, [router]);
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/auth")
  }
  return (
    <div>
      <button onClick={() => router.push("/room/join-room")}>Join Room</button>
      <br />
      <button onClick={() => router.push("/room/create-room")}>
        Create Room
      </button>
      <br />
      <button onClick={handleLogout}>Log OUt</button>
    </div>
  );
};

export default Room;
