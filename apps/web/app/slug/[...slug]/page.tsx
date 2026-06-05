 "use client"

import axios from "axios"
import { DATABASE_URL } from "../../../config"
import { ChatRoom } from "../../../components/ChatRoom"


async function getRoomId(slug:string) {
  const response = await axios.get(`${DATABASE_URL}/room/${slug}`)
  return response.data?.id
}

export default async function chatRoom({
  params
}:{
  params:{
    slug:string
  }
}){
  const slug = await params.slug;
  const roomId = await getRoomId(slug) as string;

  return (
    <div>
      <ChatRoom id={roomId}/>
    </div>
  )
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