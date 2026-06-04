"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const AuthPage = () => {
    const router = useRouter()
  return (
    <div>
        <div>
            <button onClick={() => router.push("/auth/sing-up")}>Sign Up</button>
            <button onClick={() => router.push("/auth/sign-in")}>Sing In</button>
        </div>
    </div>
  )
}

export default AuthPage