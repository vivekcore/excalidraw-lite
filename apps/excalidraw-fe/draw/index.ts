import { Tshape } from "@/components/canvas";
import { api } from "@/lib/axios";

type Shapes =
  | {
      type: "rect";
      X: number;
      Y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      X: number;
      Y: number;
      radius: number;
    }
  | {
      type: "ellipse";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
    };

export default async function InitDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shapeKind: Tshape,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const existingShapes: Shapes[] = (await getShapes(roomId)) || [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    if (shapeKind === "rectangle") {
      BroadCastRectangle(
        startX,
        startY,
        width,
        height,
        existingShapes,
        socket,
        roomId,
      );
    }
    if (shapeKind === "circle") {
      BroadCastCircle(
        startX,
        startY,
        width,
        height,
        existingShapes,
        socket,
        roomId,
      );
    }
    if (shapeKind === "ellipse") {
      BroadCastEllipse(
        startX,
        startY,
        width,
        height,
        existingShapes,
        socket,
        roomId,
      );
    }
    ClearCanvas(existingShapes, canvas, ctx);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    ClearCanvas(existingShapes, canvas, ctx);
    ctx.beginPath()
    ctx.strokeStyle = "yellow";
    if (shapeKind === "rectangle") {
      ctx.strokeRect(startX, startY, width, height);
    }
    if (shapeKind === "circle") {
      CreateCircle(startX, startY, width, height, ctx);
    }
    if (shapeKind === "ellipse") {
      CreateEllipse(startX, startY, width, height, ctx);
    }
    ctx.stroke();
  });

  function ClearCanvas(
    ExShape: Shapes[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ExShape.map((shape) => {
      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      if (shape.type === "rect") {
        ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height);
      }
      if (shape.type === "circle") {
        ctx.ellipse(shape.X, shape.Y, shape.radius,shape.radius,0, 0, Math.PI * 2);
      }
      if (shape.type === "ellipse") {
        ctx.ellipse(
          shape.centerX,
          shape.centerY,
          shape.radiusX,
          shape.radiusY,
          0,
          0,
          2 * Math.PI,
        );
      }
      ctx.stroke();
    });
  }
}

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

function CreateCircle(
  x: number,
  y: number,
  w: number,
  h: number,
  ctx: CanvasRenderingContext2D,
) {
  //const radius = Math.sqrt(Math.pow(w - x, 2) + Math.pow(h - y, 2));
  const radius = Math.min(Math.abs(w/2),Math.abs(h/2))
  ctx.ellipse(x, y, radius,radius, 0,0, 2 * Math.PI);
}

function CreateEllipse(
  x: number,
  y: number,
  w: number,
  h: number,
  ctx: CanvasRenderingContext2D,
) {
  const centerX = x + w/2;
  const centerY = y + h/2;

  const radiusX = Math.abs(w / 2);
  const radiusY = Math.abs(h / 2);
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
}

function BroadCastCircle(
  x: number,
  y: number,
  w: number,
  h: number,
  ExShapes: Shapes[],
  socket: WebSocket,
  roomId: string,
) {
 const radius = Math.min(Math.abs(w/2),Math.abs(h/2))
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
  const centerX = x + w/2;
  const centerY = y + h/2;

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
      message: {
        type: "ellipse",
        centerX,
        centerY,
        radiusX,
        radiusY,
      },
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
    type: "rect",
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
        type: "rect",
        X: x,
        Y: y,
        height: h,
        width: w,
      }),
    }),
  );
}
