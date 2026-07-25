"use client";

import { getToken } from "@/utils/token";
import { DoorOpen, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || token === "undefined") {
      router.push("/sign-in");
    }
  }, [router]);

  return (
    <div className="pixel-page flex flex-1 items-center justify-center px-5 py-8">
      <main className="w-full max-w-5xl space-y-6">
        <section className="pixel-panel-strong p-5 sm:p-7">
          <p className="pixel-kicker">Room console</p>
          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="pixel-title text-3xl font-black uppercase text-[var(--pixel-yellow)] sm:text-5xl">
                Choose a board
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--pixel-muted)] sm:text-base">
                Launch a new shared canvas or jump into an existing room with
                its room ID.
              </p>
            </div>
            <div className="pixel-stat px-4 py-3 font-mono text-xs font-black uppercase text-[var(--pixel-cyan)]">
              Realtime ready
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <button
            onClick={() => router.push("/room/create-room")}
            className="pixel-card group p-5 text-left sm:p-6"
          >
            <div className="mb-8 grid h-12 w-12 place-items-center border-2 border-[var(--pixel-yellow)] bg-[var(--pixel-yellow)] text-[var(--pixel-ink)] shadow-[4px_4px_0_var(--pixel-ink)]">
              <Plus className="h-6 w-6" />
            </div>
            <h2 className="font-mono text-xl font-black uppercase text-[var(--pixel-text)]">
              Create room
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--pixel-muted)]">
              Generate a fresh canvas and start drawing immediately.
            </p>
          </button>

          <button
            onClick={() => router.push("/room/join-room")}
            className="pixel-card group p-5 text-left sm:p-6"
          >
            <div className="mb-8 grid h-12 w-12 place-items-center border-2 border-[var(--pixel-cyan)] bg-[#0f1320] text-[var(--pixel-cyan)] shadow-[4px_4px_0_var(--pixel-ink)]">
              <DoorOpen className="h-6 w-6" />
            </div>
            <h2 className="font-mono text-xl font-black uppercase text-[var(--pixel-text)]">
              Join room
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--pixel-muted)]">
              Enter a known room ID and sync into the active board.
            </p>
          </button>
        </section>

        <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[var(--pixel-muted)]">
          <Users className="h-4 w-4 text-[var(--pixel-green)]" />
          Shape sync and chat use the existing realtime channel.
        </div>
      </main>
    </div>
  );
};

export default Page;
