"use client";
import {
  Check,
  Copy,
  Ellipse,
  Minus,
  MousePointer,
  Paintbrush,
  Pencil,
  RectangleHorizontal,
  Triangle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Tshape } from "@/draw/types";
import { Game } from "@/draw/Game";
import { Listener } from "@/hooks/useWebSocket";

export default function Canvas({
  roomId,
  sendMessage,
  subscribe,
}: {
  roomId: string;
  sendMessage: (data: string) => void;
  subscribe: (topic: string, fn: Listener) => () => void;
}) {
  const cnavasref = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>("#FFFF00");
  const colorref = useRef<string>(color);
  const [shape, setShape] = useState<Tshape>(null);
  const [copied, setCopied] = useState(false);
  const shapeRef = useRef<Tshape>(null);

  useEffect(() => {
    colorref.current = color;
  }, [color]);

  useEffect(() => {
    shapeRef.current = shape;
  }, [shape]);

  useEffect(() => {
    if (cnavasref.current) {
      const game = new Game(
        cnavasref.current,
        roomId,
        colorref,
        shapeRef,
        subscribe,
        sendMessage,
      );
      return () => game.destroy();
    }
  }, [roomId, sendMessage, subscribe]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      switch (key) {
        case "v":
        case "1":
          setShape(null);
          break;
        case "r":
        case "2":
          setShape("rectangle");
          break;
        case "e":
        case "3":
          setShape("ellipse");
          break;
        case "t":
        case "4":
          setShape("triangle");
          break;
        case "l":
        case "5":
          setShape("line");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy room ID: ", err);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setColor(color);
  };
  const tools = [
    { id: null, icon: MousePointer, label: "Select (V / 1)" },
    { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle (R / 2)" },
    { id: "ellipse", icon: Ellipse, label: "Ellipse (E / 3)" },
    { id: "triangle", icon: Triangle, label: "Triangle (T / 4)" },
    { id: "line", icon: Minus, label: "Line (L / 5)" },
    { id: "pencil", icon: Pencil, label: "Pencil" },
  ] as const;

  return (
    <>
      <canvas
        className="absolute inset-0 block h-full w-full bg-[#07080d]"
        ref={cnavasref}
      />

      <div className="pixel-panel fixed left-4 top-24 z-50 w-44 p-3 sm:left-6 sm:top-28">
        <div className="space-y-2">
          <label className="pixel-label" htmlFor="color">
            Stroke
          </label>
          <input
            className="h-10 w-full cursor-pointer border-2 border-[var(--pixel-line)] bg-[#0f1320] p-1 shadow-[3px_3px_0_var(--pixel-ink)]"
            onChange={handleChange}
            value={color}
            type="color"
            id="color"
          />
        </div>
      </div>

      <div className="pixel-panel fixed left-1/2 top-4 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-col gap-3 p-2 sm:top-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 border-b-2 border-[var(--pixel-line)] px-2 pb-2 sm:border-b-0 sm:border-r-2 sm:pb-0 sm:pr-4">
          <div className="grid h-9 w-9 place-items-center border-2 border-[var(--pixel-cyan)] bg-[#0f1320] shadow-[3px_3px_0_var(--pixel-ink)]">
            <Paintbrush className="h-4 w-4 animate-pulse text-[var(--pixel-cyan)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-black uppercase leading-none text-[var(--pixel-text)]">
              ExcaliDraw
            </span>
            <span className="mt-1 font-mono text-[10px] font-black uppercase leading-none text-[var(--pixel-yellow)]">
              Lite
            </span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:flex sm:items-center sm:px-2">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = shape === tool.id;
            return (
              <div key={tool.id ?? "select"} className="relative group">
                <button
                  onClick={() => setShape(tool.id)}
                  className={`pixel-tool flex h-9 w-9 items-center justify-center ${
                    isActive
                      ? "pixel-tool-active"
                      : "text-[var(--pixel-muted)]"
                  }`}
                  aria-label={tool.label}
                  title={tool.label}
                >
                  <IconComponent className="h-4 w-4 stroke-2" />
                </button>

                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 scale-95 whitespace-nowrap border-2 border-[var(--pixel-line)] bg-[#0f1320] px-2 py-1.5 font-mono text-[10px] font-black uppercase text-[var(--pixel-text)] opacity-0 shadow-[3px_3px_0_var(--pixel-ink)] transition-all duration-150 group-hover:scale-100 group-hover:opacity-100">
                  {tool.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t-2 border-[var(--pixel-line)] pt-2 sm:border-l-2 sm:border-t-0 sm:pl-3 sm:pt-0">
          <button
            onClick={handleCopyRoomId}
            className="pixel-button max-w-full px-3 py-2 text-xs"
            title="Click to copy Room ID"
          >
            <span className="h-2 w-2 animate-pulse bg-[var(--pixel-green)]" />
            <span className="hidden sm:inline">Room</span>
            <span className="max-w-28 truncate font-mono select-all text-[var(--pixel-text)] sm:max-w-40">
              {roomId}
            </span>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[var(--pixel-green)]" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[var(--pixel-cyan)]" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
