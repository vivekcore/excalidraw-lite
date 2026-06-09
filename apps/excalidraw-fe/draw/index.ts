import { api } from "@/lib/axios";

type Shapes = {
  type: "rect";
  X: number;
  Y: number;
  width: number;
  height: number;
};


export default async function InitDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  ctx: CanvasRenderingContext2D
) {
  // console.log(canvas)
  const existingShapes: Shapes[] = (await getShapes(roomId)) || [];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    if (message.type === "chat") {
      const parserShape = JSON.parse(message.message);
      console.log(parserShape)
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

    existingShapes.push({
      type: "rect",
      X: startX,
      Y: startY,
      height,
      width
    });
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify({
          type: "rect",
          X: startX,
          Y: startY,
          height,
          width
        }),
      }),
    );
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!clicked) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    ClearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "yellow";
    ctx.strokeRect(startX, startY, width, height);
  });

  function ClearCanvas(
    ExShape: Shapes[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ExShape.map((shape) => {
      if (shape.type === "rect") {
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height);
      }
    });
  }
}

async function getShapes(roomId: string) {
  try {
    const response = await api.get(`/room/chats/${roomId}`);
    const data = response.data.data as [];
    const parse = data.map((e) => JSON.parse(e));
    
    return parse
  } catch (error) { 
    console.log(error)
    return [];
  }
}
