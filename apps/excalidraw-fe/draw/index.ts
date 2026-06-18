import { Tshape } from "@/components/canvas";
import { api } from "@/lib/axios";
import { Shapes } from "./types";

export default async function InitDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shapeKind: { current: Tshape },
) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const existingShapes: Shapes[] = await getShapes(roomId);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ClearCanvas(existingShapes, canvas, ctx);
  ctx.fillStyle = "black";

  let clicked = false;
  let startX = 0;
  let startY = 0;

  socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type === "chat") {
      const parserShape = JSON.parse(message.message);
      existingShapes.push(parserShape);
      ClearCanvas(existingShapes, canvas, ctx);
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };
  const onMouseUp = (e: MouseEvent) => {
    clicked = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    switch (shapeKind.current) {
      case "rectangle":
        BroadCastRectangle(
          startX,
          startY,
          width,
          height,
          existingShapes,
          socket,
          roomId,
        );
        break;
      case "circle":
        BroadCastCircle(
          startX,
          startY,
          width,
          height,
          existingShapes,
          socket,
          roomId,
        );
        break;
      case "ellipse":
        BroadCastEllipse(
          startX,
          startY,
          width,
          height,
          existingShapes,
          socket,
          roomId,
        );
        break;
      case "line":
        BroadCastLine(
          startX,
          startY,
          e.offsetX,
          e.offsetY,
          existingShapes,
          roomId,
          socket,
        );
        break;
      case "triangle":
        BroadCastTriangle(
          startX,
          startY,
          e.offsetX,
          e.offsetY,
          existingShapes,
          socket,
          roomId,
        );
        break;
      // case "pencil":
      //BroadCastPencilDraw(startX,startY,e.offsetX,e.offsetY,ctx,existingShapes,socket,roomId)
      //  break;
      //   break;
      default:
        break;
    }
    if (shapeKind.current !== "pencil") {
      ClearCanvas(existingShapes, canvas, ctx);
    }
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!clicked) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    if (shapeKind.current !== "pencil") {
      ClearCanvas(existingShapes, canvas, ctx);
    }

    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    switch (shapeKind.current) {
      case "rectangle":
        ctx.strokeRect(startX, startY, width, height);
        break;
      case "circle":
        CreateCircle(startX, startY, width, height, ctx);
        break;
      case "ellipse":
        CreateEllipse(startX, startY, width, height, ctx);
        break;
      case "line":
        CreateLine(startX, startY, e.offsetX, e.offsetY, ctx);
        break;
      case "triangle":
        CreateTriangle(startX, startY, e.offsetX, e.offsetY, ctx);
        break;
      case "pencil":
        CreateWithPencil(
          startX,
          startY,
          e.offsetX,
          e.offsetY,
          ctx,
          existingShapes,
        );
        startX = e.offsetX;
        startY = e.offsetY;
      default:
        break;
    }
    ctx.stroke();
  };
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", onMouseDown);
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
  };
}

//clearing canvas and redraw for real time shape draw
function ClearCanvas(
  ExShape: Shapes[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ExShape.map((shape) => {
    ctx.strokeStyle = "yellow";
    ctx.beginPath();

    switch (shape.type) {
      case "rectangle":
        ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height);
        break;
      case "circle":
        ctx.arc(shape.X, shape.Y, shape.radius, 0, Math.PI * 2);
        break;
      case "ellipse":
        ctx.ellipse(
          shape.centerX,
          shape.centerY,
          shape.radiusX,
          shape.radiusY,
          0,
          0,
          2 * Math.PI,
        );
        break;
      case "line":
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        break;
      case "triangle":
        ctx.moveTo((shape.startX + shape.endX) / 2, shape.startY);
        ctx.lineTo(shape.startX, shape.endY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.closePath();
        break;
      default:
        break;
    }

    ctx.stroke();
  });
}

//Extracting exesting shapes from database
async function getShapes(roomId: string) {
  try {
    const response = await api.get(`/room/chats/${roomId}`);
    const data = response.data.data as [];
    const parse = data.map((e) => JSON.parse(e));

    return parse;
  } catch (error) {
    console.log(error);
    return [];
  }
}

//functions for creating shapes
function CreateCircle(
  x: number,
  y: number,
  w: number,
  h: number,
  ctx: CanvasRenderingContext2D,
) {
  const radius = Math.sqrt(w * w + h * h);
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
}
function CreateEllipse(
  x: number,
  y: number,
  w: number,
  h: number,
  ctx: CanvasRenderingContext2D,
) {
  const centerX = x + w / 2;
  const centerY = y + h / 2;

  const radiusX = Math.abs(w / 2); //* Math.sqrt(2);
  const radiusY = Math.abs(h / 2); //* Math.sqrt(2)
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
}
function CreateLine(
  x: number,
  y: number,
  endX: number,
  endY: number,
  ctx: CanvasRenderingContext2D,
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}
function CreateTriangle(
  x: number,
  y: number,
  endX: number,
  endY: number,
  ctx: CanvasRenderingContext2D,
) {
  ctx.moveTo((x + endX) / 2, y);
  ctx.lineTo(x, endY);
  ctx.lineTo(endX, endY);
  ctx.closePath();
}
function CreateWithPencil(
  x: number,
  y: number,
  endX: number,
  endY: number,
  ctx: CanvasRenderingContext2D,
  // socket:WebSocket,
  ExShapes: Shapes[],
  // roomId: string
) {
  ctx.moveTo(x, y);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 2;
  ctx.closePath();

  ctx.stroke();
  ExShapes.push({
    type: "pencil",
    startX: x,
    startY: y,
    endX,
    endY,
  });
  //BroadCastPencilDraw(x,y,endX,endY,ctx,ExShapes,socket,roomId)
}
//Functions for sending shapes through websockets to database
// function BroadCastPencilDraw(x:number,y:number,endX:number,endY:number,ctx:CanvasRenderingContext2D,ExShapes:Shapes[],socket:WebSocket,roomId:string){
//   ExShapes.push({
//     type:"pencil",
//     startX:x,
//     startY:y,
//     endX,
//     endY
//   })
//   socket.send(JSON.stringify({
//     type:"chat",
//     roomId,
//     message:JSON.stringify({
//       type:"pencil",
//     startX:x,
//     startY:y,
//     endX,
//     endY
//     })
//   }))
// }
function BroadCastCircle(
  x: number,
  y: number,
  w: number,
  h: number,
  ExShapes: Shapes[],
  socket: WebSocket,
  roomId: string,
) {
  const radius = Math.sqrt(w * w + h * h);
  ExShapes.push({
    type: "circle",
    X: x,
    Y: y,
    radius,
  });
  socket.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify({
        type: "circle",
        X: x,
        Y: y,
        radius,
      }),
    }),
  );
}
function BroadCastEllipse(
  x: number,
  y: number,
  w: number,
  h: number,
  ExShapes: Shapes[],
  socket: WebSocket,
  roomId: string,
) {
  const centerX = x + w / 2;
  const centerY = y + h / 2;

  const radiusX = Math.abs(w / 2);
  const radiusY = Math.abs(h / 2);

  ExShapes.push({
    type: "ellipse",
    centerX,
    centerY,
    radiusX,
    radiusY,
  });
  socket.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify({
        type: "ellipse",
        centerX,
        centerY,
        radiusX,
        radiusY,
      }),
    }),
  );
}
function BroadCastRectangle(
  x: number,
  y: number,
  w: number,
  h: number,
  ExShapes: Shapes[],
  socket: WebSocket,
  roomId: string,
) {
  ExShapes.push({
    type: "rectangle",
    X: x,
    Y: y,
    width: w,
    height: h,
  });
  socket.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify({
        type: "rectangle",
        X: x,
        Y: y,
        height: h,
        width: w,
      }),
    }),
  );
}
function BroadCastLine(
  x: number,
  y: number,
  endX: number,
  endY: number,
  ExShapes: Shapes[],
  roomId: string,
  socket: WebSocket,
) {
  ExShapes.push({
    type: "line",
    startX: x,
    startY: y,
    endX,
    endY,
  });
  socket.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify({
        type: "line",
        startX: x,
        startY: y,
        endX,
        endY,
      }),
    }),
  );
}
function BroadCastTriangle(
  x: number,
  y: number,
  endX: number,
  endY: number,
  ExShapes: Shapes[],
  socket: WebSocket,
  roomId: string,
) {
  ExShapes.push({
    type: "triangle",
    startX: x,
    startY: y,
    endX,
    endY,
  });
  socket.send(
    JSON.stringify({
      type: "chat",
      roomId,
      message: JSON.stringify({
        type: "triangle",
        startX: x,
        startY: y,
        endX,
        endY,
      }),
    }),
  );
}
