"use client";
import InitDraw from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const cnavasref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cnavasref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    InitDraw(canvas, roomId, socket, ctx);
  }, [cnavasref, roomId, socket]);

  return <canvas ref={cnavasref}/>
}
