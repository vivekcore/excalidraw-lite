"use client"

import { getToken } from '@/utils/token';
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter();
    const token = getToken()
    if(!token){
        router.push("/sign-in")
    }
  return (
    <div>
        <div>Welcome to excalidraw</div>
        <div>
            <button onClick={() => router.push("room/create-room")}>Create Room</button>
            <button onClick={() => router.push("join-room")}>Join Room</button>
        </div>
    </div>
  )
}

export default Page