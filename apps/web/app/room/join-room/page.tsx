"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "../../../utils/axiox";

const JoinRoom = () => {
  const { register, handleSubmit } = useForm<{ slug: string }>();
  const router = useRouter();

  const onSubmit = async (data: { slug: string }) => {
    try {
      const response = await api.get(`/room/slug/${data.slug}`);

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
