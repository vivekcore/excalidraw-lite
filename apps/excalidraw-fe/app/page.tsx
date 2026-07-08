"use client";

import { ArrowRight, LogIn, PenLine, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="pixel-page flex flex-1 items-center px-5 py-8 sm:px-8">
      <main className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-7">
          <div className="pixel-kicker inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Realtime sketch terminal
          </div>

          <div className="space-y-5">
            <h1 className="pixel-title text-4xl font-black leading-tight text-[var(--pixel-text)] sm:text-6xl">
              EXCALIDRAW
              <span className="block text-[var(--pixel-yellow)]">PIXEL ROOM</span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--pixel-muted)] sm:text-lg">
              Create a room, draw sharp shapes with your crew, and keep the room
              chat running beside the canvas.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/sign-in")}
              className="pixel-button pixel-button-primary px-5 py-3"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="pixel-button px-5 py-3"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="pixel-panel-strong p-4 sm:p-6">
          <div className="pixel-grid-bg grid aspect-[4/3] place-items-center border-2 border-[var(--pixel-ink)] bg-[#0f1320] p-4">
            <div className="relative h-full w-full">
              <div className="absolute left-[10%] top-[12%] h-[32%] w-[42%] border-4 border-[var(--pixel-cyan)] bg-[#151925] shadow-[8px_8px_0_var(--pixel-ink)]" />
              <div className="absolute bottom-[16%] right-[10%] h-[38%] w-[38%] rounded-full border-4 border-[var(--pixel-pink)]" />
              <div className="absolute bottom-[18%] left-[14%] h-1 w-[54%] rotate-[-18deg] bg-[var(--pixel-yellow)] shadow-[4px_4px_0_var(--pixel-ink)]" />
              <div className="absolute right-[18%] top-[14%] border-x-[34px] border-b-[58px] border-x-transparent border-b-[var(--pixel-green)] drop-shadow-[6px_6px_0_var(--pixel-ink)]" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between border-2 border-[var(--pixel-line)] bg-[var(--pixel-panel)] px-3 py-2 font-mono text-xs font-black uppercase text-[var(--pixel-yellow)]">
                <span className="inline-flex items-center gap-2">
                  <PenLine className="h-4 w-4" />
                  Shape sync
                </span>
                <span className="inline-flex items-center gap-2 text-[var(--pixel-cyan)]">
                  <Users className="h-4 w-4" />
                  Live chat
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
