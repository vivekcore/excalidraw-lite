"use client";
import InitDraw from "@/draw";
import { useEffect, useRef, useState } from "react";

export type Tshape = "circle" | "rectangle" | "ellipse"
export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const cnavasref = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<Tshape>("rectangle");
  useEffect(() => {
    if (cnavasref.current) {
      InitDraw(cnavasref.current, roomId, socket, shape);
    }
  }, [cnavasref, roomId, socket, shape]);

  return (
    <>
      <canvas className="relative" ref={cnavasref} />
      <div className="absolute right-8 top-4">
        <div className="flex gap-4">
          <button
            onClick={() => setShape("circle")}
            className="border-2 px-2 rounded-2xl py-1 hover:scale-105 active:scale-95 transition-all duration-150 hover:bg-white hover:text-black hover:border-blue-700 cursor-pointer"
          >
            Circle
          </button>
          <button
            onClick={() => setShape("rectangle")}
            className=" px-2 py-1 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-150 hover:bg-white hover:text-black hover:border-blue-700 border-2 cursor-pointer"
          >
            Rectangel
          </button>
          <button
            onClick={() => setShape("ellipse")}
            className=" px-2 py-1 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-150 hover:bg-white hover:text-black hover:border-blue-700 border-2 cursor-pointer"
          >
            Ellipse
          </button>
        </div>
      </div>
    </>
  );
}
