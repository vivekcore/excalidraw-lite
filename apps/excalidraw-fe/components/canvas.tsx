"use client"
import InitDraw from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}) {
  const cnavasref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!cnavasref.current) return;
    InitDraw(cnavasref.current, roomId,socket);
  }, [cnavasref,roomId,socket]);

   return <canvas ref={cnavasref}></canvas>;
}
