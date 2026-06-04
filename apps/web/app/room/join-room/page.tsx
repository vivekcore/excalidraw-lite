"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";

const JoinRoom = () => {
  const { register, handleSubmit } = useForm<{ slug: string }>();
  const router = useRouter();
  const [token, setToken] = useState<string>();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === null) {
      router.push("/auth");
      return;
    }
    setToken(token);
  }, [router]);

  const onSubmit = async (data: { slug: string }) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/room/slug/${data.slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.status === 200) {
        router.push(`/slug/${data.slug}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={() => router.push("/room")}>{"<-- "}Back</button>
      <div>
        <h1>JOIN ROOM</h1>
      </div>
      <button onClick={() => router.push("/room/create-room")}>Create Room</button>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="slug">Enter Room ID</label>
            <input type="text" id="slug" {...register("slug")} />
          </div>
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
