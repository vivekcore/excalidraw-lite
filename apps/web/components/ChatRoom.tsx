"use client"
import { useEffect, useState } from "react";
import { api } from "../utils/axiox";
import ChatRoomClient from "./ChatRoomClient";

// async function getChats(roomId: string){
 

//     const response = await api.get(`/chats/${roomId}`)
//     return response.data?.data?.message
// }

export function ChatRoom({id}:{id:string}) {
    
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        api.get(`/room/chats/${id}`).then((r) => setMessages(r.data.data));
    },[id])
   
    return <ChatRoomClient id={id} messages={messages}/>
}