
import RoomCanvas from "@/components/RoomCanvas";

const CanvasServer = async ({params}:{
  params:{
    roomId:string
  }
}) => {
  const roomId = (await params).roomId
  
  return <RoomCanvas key={roomId} roomId={roomId}/>

 
};

export default CanvasServer;
