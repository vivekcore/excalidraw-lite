"use client";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const token = getToken();
  if (!token) {
    router.push("/sign-in");
  }
  const { register, handleSubmit } = useForm<{ roomId: string }>();
  const onSubmit = async (data: { roomId: string }) => {
    try {
      const response = await api.get(`/room/chats/${data.roomId}`);
      if (response.status === 200) {
        router.push(`/canvas/${data.roomId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="roomId">Room ID</label>
        <input type="number" {...register("roomId")} id="roomId" />
        <button type="submit">join</button>
      </form>
    </div>
  );
};

export default Page;
