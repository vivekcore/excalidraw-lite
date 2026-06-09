"use client"
import { useEffect, useState } from 'react'
import Canvas from './canvas'
import { WS_URL } from '@/config';
import { getToken } from '@/utils/token';

const RoomCanvas = ({roomId}:{roomId:string}) => {
    const token = getToken()
    const [socket,setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=${token}`)
        ws.onopen = () => {
            setSocket(ws)
            socket?.send(JSON.stringify({
                type:"join_room",
                roomId
            }))
        }
    },[roomId,token])
    if(socket === null){
        return <div>Connecting to server...</div>
    }
  return (
    <Canvas roomId={roomId} socket={socket}/>
  )
}

export default RoomCanvas