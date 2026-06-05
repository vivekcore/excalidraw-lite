import axios from "axios";
import { DATABASE_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(roomId: string){
    const response = await axios.get(`${DATABASE_URL}/chats/${roomId}`)
    return response.data?.data?.message
}

export async function ChatRoom({id}:{id:string}) {
    const messages = await getChats(id);
   
    return <ChatRoomClient id={id} messages={messages}/>
}