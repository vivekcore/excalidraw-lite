"use client";
import { api } from "@/lib/axios";
import { getToken } from "@/utils/token";
import { ArrowLeft, ArrowRight, DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/sign-in");
    }
  }, [router]);

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
    <div className="pixel-page flex flex-1 items-center justify-center px-5 py-8">
      <main className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pixel-panel-strong space-y-6 p-5 sm:p-7"
        >
          <button
            type="button"
            onClick={() => router.push("/room")}
            className="pixel-button px-3 py-2 text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Rooms
          </button>

          <div>
            <p className="pixel-kicker inline-flex items-center gap-2">
              <DoorOpen className="h-4 w-4" />
              Existing board
            </p>
            <h1 className="pixel-title mt-4 text-3xl font-black uppercase text-[var(--pixel-yellow)] sm:text-5xl">
              Join room
            </h1>
            <p className="mt-3 text-sm leading-6 text-[var(--pixel-muted)]">
              Enter a room ID to verify access and open its shared canvas.
            </p>
          </div>

          <div className="space-y-2">
            <label className="pixel-label" htmlFor="roomId">
              Room ID
            </label>
            <input
              className="pixel-input px-4 py-3"
              type="number"
              {...register("roomId")}
              id="roomId"
            />
          </div>

          <button
            type="submit"
            className="pixel-button pixel-button-primary w-full px-5 py-3"
          >
            Join
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default Page;
