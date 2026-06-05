import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSockets";
import { json } from "stream/consumers";

const ChatRoomClient = ({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) => {
    const [chats,setChats] = useState(messages)
    const {socket,loading} = useSocket();
    const [cMessage,setCmessage] = useState<string>()
    useEffect(() => {

        if(socket && !loading){
            socket.send(JSON.stringify({
                type:"join_room",
                roomId: id
            }))
            socket.onmessage = (event) => {
                const parseData = JSON.parse(event.data);
                if(parseData.type === "chat"){
                    setChats(c => [...c, parseData.message])
                }
            }
        }

    },[socket,loading,id])
  return (
    <div>
        {
            chats.map(m => (<div key={m.message}>{m.message}</div>))
        }
        <input type="text" value={cMessage} onChange={e => {
            setCmessage(e.target.value)
        }} />
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type:"chat",
                roomId:id,
                message:cMessage
            }))
        }}></button>
    </div>
  )
};

export default ChatRoomClient;
