import jwt, { JwtPayload } from 'jsonwebtoken';
import WebSocket, { WebSocketServer } from 'ws';
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws:WebSocket,
  room:string[],
  userId:string
}
const users:User[] = [];
const checkUser = (token:string):string|null => {
    const decode = jwt.verify(token,JWT_SECRET)

    if(typeof decode == "string"){
      return null;
    }
    if( !decode || !decode.userId){
      return null
    }
    return decode.userId;
}

wss.on('connection', function connection(ws,request) {
  ws.on('error', console.error);

 const url = request.url;
 if(!url){
  return;
 }
 const queryParams = new URLSearchParams(url.split('?')[1]);
 const token = queryParams.get('token') || "";
 const userId = checkUser(token)
 
if(!userId || userId === null){
  ws.close();
  return;
}
users.push({
  ws,
  userId,
  room:[]
})
 ws.on('message', (data) => {
  const parseData = JSON.parse(data as unknown as string);
  if(parseData.type === "join_room"){
    const user = users.find((x) => x.ws === ws);
    user?.room.push(parseData.roomId);
  }

  if(parseData.type === "leave_room"){
    const user = users.find((x) => x.ws === ws)
    if(!user){
      return
    }
    user.room = user.room.filter(x => x === parseData.roomId);
  }

  if(parseData.type === "chat"){
    const roomId = parseData.roomId;
    const message = parseData.message;

    users.forEach(user => {
      if(user.room.includes(roomId)){
        user.ws.send(JSON.stringify({
          type: "chat",
          message: message,
          roomId
        }))
      }
    })
  }
 })
});