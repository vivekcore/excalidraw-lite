"use client";
import InitDraw from "@/draw";
import { 
  Circle, 
  Ellipse, 
  Minus, 
  RectangleHorizontal, 
  Triangle,
  MousePointer,
  Paintbrush,
  Copy,
  Check,
  Pencil
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type Tshape ="circle" | "rectangle" | "ellipse" | "triangle" | "line" |"pencil"| null;

export default function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const cnavasref = useRef<HTMLCanvasElement>(null);
  const [shape, setShape] = useState<Tshape>(null);
  const [copied, setCopied] = useState(false);

  const shapeRef = useRef<Tshape>(null);
  useEffect(() => {
    shapeRef.current = shape;
  },[shape])
  

  useEffect(() => {
    if (cnavasref.current) {
      InitDraw(cnavasref.current, roomId, socket, shapeRef);
    }
  }, [roomId, socket]);

  // Keyboard Shortcuts for drawing tools
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
        case "c":
        case "3":
          setShape("circle");
          break;
        case "e":
        case "4":
          setShape("ellipse");
          break;
        case "t":
        case "5":
          setShape("triangle");
          break;
        case "l":
        case "6":
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

  const tools = [
    { id: null, icon: MousePointer, label: "Select (V / 1)" },
    { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle (R / 2)" },
    { id: "circle", icon: Circle, label: "Circle (C / 3)" },
    { id: "ellipse", icon: Ellipse, label: "Ellipse (E / 4)" },
    { id: "triangle", icon: Triangle, label: "Triangle (T / 5)" },
    { id: "line", icon: Minus, label: "Line (L / 6)" },
    {id : "pencil", icon: Pencil, label: "Pencil (p / 7)"}
  ] as const;

  return (
    <>
      <canvas className="relative bg-zinc-950 block w-full h-full" ref={cnavasref} />
      
      {/* Floating Modern Header */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 px-4 py-2 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-zinc-700/80">
        
        {/* Left Section: Brand Logo & Title */}
        <div className="flex items-center gap-2.5 border-r border-zinc-800/80 pr-4 mr-1">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Paintbrush className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-zinc-100 tracking-wide leading-none">ExcaliDraw</span>
            <span className="text-[10px] text-zinc-500 font-medium leading-none mt-0.5">Lite</span>
          </div>
        </div>

        {/* Middle Section: Drawing Tools */}
        <div className="flex items-center gap-1.5 px-3">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = shape === tool.id;
            return (
              <div key={tool.id ?? "select"} className="relative group">
                <button
                  onClick={() => setShape(tool.id)}
                  className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center border cursor-pointer active:scale-95 ${
                    isActive
                      ? "bg-violet-500/15 border-violet-500/40 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                      : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  }`}
                  aria-label={tool.label}
                >
                  <IconComponent className="w-5 h-5 stroke-2" />
                </button>
                
                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-zinc-950 text-zinc-200 text-[10px] font-medium px-2 py-1.5 rounded-lg border border-zinc-800 shadow-xl whitespace-nowrap z-50">
                  {tool.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Section: Room ID Info with Copy Action */}
        <div className="flex items-center gap-2 border-l border-zinc-800/80 pl-4 ml-1">
          <button
            onClick={handleCopyRoomId}
            className="flex items-center gap-2 bg-zinc-950/60 hover:bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700/60 rounded-xl px-3 py-1.5 text-xs text-zinc-400 font-medium transition-all duration-150 cursor-pointer active:scale-95"
            title="Click to copy Room ID"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Room:</span>
            <span className="font-mono text-zinc-300 select-all">{roomId}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 transition-all" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 transition-all" />
            )}
          </button>
        </div>

      </div>
    </>
  );
}
