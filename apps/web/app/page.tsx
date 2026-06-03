"use client"
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter()
  return (
    <div >
     
     <div>
      <h1>chat Application</h1>
     </div>
      <div>
        <div>
          <button onClick={() => router.push("/auth/sign-up")}>Sign up</button>
        </div>
        <div>
          <button onClick={() => router.push("/auth/sign-in")}>Sign in</button>
        </div>
      </div>
    </div>
  );
}
