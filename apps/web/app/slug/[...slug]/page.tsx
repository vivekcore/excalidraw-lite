"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatRoom } from "../../../components/ChatRoom";
import { api } from "../../../utils/axiox";

export default function ChatRoomSlug() {
  const params = useParams();
  const slug = params?.slug?.[0];
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.get(`/room/slug/${slug}`)
      .then((r) => setRoomId(r.data?.data?.id))
      .catch(() => setError(true));
  }, [slug]);

  if (error) return <div>Server error with 404</div>;
  if (!roomId) return <div>Loading...</div>;

  return <ChatRoom id={roomId} />;
}

// import { useRouter } from 'next/navigation'
// import React, { useEffect } from 'react'
// import { useForm } from 'react-hook-form'

// const ChatRoom = () => {
//   const router = useRouter()
//   const {register,handleSubmit} = useForm<{message:string}>()
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if(!token || token === null){
//       router.push("/auth")
//       return;
//     }
//   })
//   const onSubmit = (data:{message:string}) => {
//    console.log(data)
//   }
//   return (
//     <div>
//       <div>
//         <form onSubmit={handleSubmit(onSubmit)} >
//           <div>
//             <textarea  id="message" {...register("message")} placeholder='Enter your message...' />
//           </div>
//           <button type='submit'>send</button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default ChatRoom
