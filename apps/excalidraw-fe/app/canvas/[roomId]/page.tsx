
import RoomCanvas from "@/components/RoomCanvas";

const CanvasServer = async ({params}:{
  params:{
    roomId:string
  }
}) => {
  const roomId = (await params).roomId
  return <RoomCanvas roomId={roomId}/>

 
};

export default CanvasServer;
