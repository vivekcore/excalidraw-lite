"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    Excalidraw landing Page
    <div>
      <button onClick={() => router.push("/sign-in")} className="border px-2 py-1 rounded-2xl ">Sign In</button>
      <button onClick={() => router.push("/sign-up")} className="border px-2 py-1 rounded-2xl">Register</button>
    </div>
    </div>
  );
}
