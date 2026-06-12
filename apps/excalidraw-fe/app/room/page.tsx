"use client"

import { getToken } from '@/utils/token';
import { useRouter } from 'next/navigation'

const Page = () => {
    const router = useRouter();
    const token = getToken()
    if(!token || token === "undefined"){
        router.push("sign-in")
    }
  return (
    <div>
        <div>Welcome to excalidraw</div>
        <div>
            <button onClick={() => router.push("room/create-room")}>Create Room</button>
            <button onClick={() => router.push("room/join-room")}>Join Room</button>
        </div>
    </div>
  )
}

export default Page