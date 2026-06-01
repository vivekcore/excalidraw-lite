import jwt, { JwtPayload } from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { JWT_SECRET } from './config';
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws,request) {
  ws.on('error', console.error);

 const url = request.url;
 if(!url){
  return;
 }
 const queryParams = new URLSearchParams(url.split('?')[1]);
 const token = queryParams.get('token') || "";
 const decode = jwt.verify(token,JWT_SECRET);
 
if(!decode || !(decode as JwtPayload).userId){
  ws.close();
  return;
}
 ws.on('message', (data) => {
  ws.send('pong');
 })
});