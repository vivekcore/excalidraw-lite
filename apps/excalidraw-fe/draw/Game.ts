import { api } from "@/lib/axios";
import { Shapes } from "./types";
import { Tshape } from "./types";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shapes[];
  private roomId: string;
  private strokeColor: { current: string };
  private shapeKind: { current: Tshape };
  private clicked: boolean;
  private startX: number;
  private startY: number;
  private socket: WebSocket;
  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    strokeColor: { current: string },
    shapeKind: { current: Tshape },
    socket: WebSocket,
    clicked: boolean = false,
    startX: number = 0,
    startY: number = 0,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.strokeColor = strokeColor;
    this.shapeKind = shapeKind;
    this.socket = socket;
    this.clicked = clicked;
    this.startX = startX;
    this.startY = startY;
    this.init();
    this.initMouseEvents();
  }
//  public destroy() {
//     this.canvas.removeEventListener("mousedown", this.onMouseDown);
//     this.canvas.removeEventListener("mousemove", this.onMouseMove);
//     this.canvas.removeEventListener("mouseup", this.onMouseUp);
//     this.socket.close();
//   }
  async init() {
    console.log("initilized")
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (!this.ctx) return;

    this.existingShapes = await this.getShapes();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.strokeStyle = this.strokeColor.current;
    this.ClearCanvas();
  }
  ClearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.existingShapes.forEach((shape) => {
      this.drawShapes(shape);
    });
  }
  drawShapes(shape: Shapes) {
    this.ctx.beginPath();

    switch (shape.type) {
      case "rectangle":
        this.ctx.strokeStyle = shape.strokeColor;
        this.ctx.strokeRect(shape.X, shape.Y, shape.width, shape.height);
        break;
      case "circle":
        this.ctx.strokeStyle = shape.strokeColor;
        this.ctx.arc(shape.X, shape.Y, shape.radius, 0, Math.PI * 2);
        break;
      case "ellipse":
        this.ctx.strokeStyle = shape.strokeColor;
        this.ctx.ellipse(
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
        this.ctx.strokeStyle = shape.strokeColor;
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        break;
      case "triangle":
        this.ctx.strokeStyle = shape.strokeColor;
        this.ctx.moveTo((shape.startX + shape.endX) / 2, shape.startY);
        this.ctx.lineTo(shape.startX, shape.endY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.closePath();
        break;
      default:
        break;
    }
    this.ctx.stroke();
  }
  async getShapes() {
    try {
      const response = await api.get(`/room/chats/${this.roomId}`);
      const data = response.data.data as [];
      const parse:Shapes[] = data.map((e) => JSON.parse(e));

      return parse;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  initMouseEvents() {
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);

  return () => {
    this.canvas.removeEventListener("mouseup", this.onMouseDown);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseleave", this.onMouseUp);
    this.socket.close();
  }
  }

  private onMouseDown = (e: MouseEvent) => {
    console.log("mosue down")
    this.clicked = true;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
  };
  private onMouseUp = (e: MouseEvent) => {
    
    this.clicked = false;
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;

    switch (this.shapeKind.current) {
      case "rectangle":
        this.BroadCastRectangle(width, height);
        break;
      case "circle":
        this.BroadCastCircle(width, height);
        break;
      case "ellipse":
        this.BroadCastEllipse(width, height);
        break;
      case "line":
        this.BroadCastLine(e.offsetX, e.offsetY);
        break;
      case "triangle":
        this.BroadCastTriangle(e.offsetX, e.offsetY);
        break;
      default:
        break;
    }
    if (this.shapeKind.current !== "pencil") {
      this.ClearCanvas();
    }
    console.log("mosue up")
  };
  private onMouseMove = (e: MouseEvent) => {
    
    if (this.clicked === false) return;
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;
    if (this.shapeKind.current !== "pencil") {
      this.ClearCanvas();
    }
    this.ctx.beginPath();
    switch (this.shapeKind.current) {
      case "rectangle":
        this.ctx.strokeRect(this.startX, this.startY, width, height);
        break;
      case "circle":
        this.CreateCircle(width, height);
        break;
      case "ellipse":
        this.CreateEllipse(width, height);
        break;
      case "line":
        this.CreateLine(e.offsetX, e.offsetY);
        break;
      case "triangle":
        this.CreateTriangle(e.offsetX, e.offsetY);
        break;
      case "pencil":
        this.CreateWithPencil(e.offsetX, e.offsetY);
        this.startX = e.offsetX;
        this.startY = e.offsetY;
      default:
        break;
    }
    this.ctx.stroke();
    console.log("mosue move")
  };

  CreateCircle(width: number, height: number) {
    const radius = Math.sqrt(width * width + height * height);
    this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
  }
  CreateEllipse(width: number, height: number) {
    const radiusX = Math.abs(width / 2);
    const radiusY = Math.abs(height / 2);

    const centreX = this.startX + width / 2;
    const centreY = this.startY + height / 2;

    this.ctx.ellipse(centreX, centreY, radiusX, radiusY, 0, 0, Math.PI * 2);
  }
  CreateLine(offsetX: number, offsetY: number) {
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(offsetX, offsetY);
  }
  CreateTriangle(offsetX: number, offsetY: number) {
    this.ctx.moveTo((this.startX + offsetX) / 2, this.startY);
    this.ctx.lineTo(this.startX, offsetY);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.closePath();
  }
  CreateWithPencil(offsetX: number, offsetY: number) {
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  }

  BroadCastRectangle(width: number, height: number) {
    const shape: Shapes = {
      type: "rectangle",
      strokeColor: this.strokeColor.current,
      X: this.startX,
      Y: this.startY,
      width,
      height,
    };
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      }),
    );
  }
  BroadCastCircle(width: number, height: number) {
    const radius = Math.sqrt(width * width + height * height);
    const shape: Shapes = {
      type: "circle",
      radius,
      X: this.startX,
      Y: this.startY,
      strokeColor: this.strokeColor.current,
    };
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      }),
    );
  }
  BroadCastEllipse(width: number, height: number) {
    const centerX = this.startX + width / 2;
    const centerY = this.startY + height / 2;

    const radiusX = Math.abs(width / 2);
    const radiusY = Math.abs(height / 2);

    const shape: Shapes = {
      type: "ellipse",
      centerX,
      centerY,
      radiusX,
      radiusY,
      strokeColor: this.strokeColor.current,
    };
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      }),
    );
  }
  BroadCastLine(offsetX: number, offsetY: number) {
    const shape: Shapes = {
      type: "line",
      startX: this.startX,
      startY: this.startY,
      endX: offsetX,
      endY: offsetY,
      strokeColor: this.strokeColor.current,
    };
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      }),
    );
  }
  BroadCastTriangle(offsetX: number, offsetY: number) {
    const shape: Shapes = {
      type: "triangle",
      startX: this.startX,
      startY: this.startY,
      endX: offsetX,
      endY: offsetY,
      strokeColor: this.strokeColor.current,
    };
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: this.roomId,
        message: JSON.stringify(shape),
      }),
    );
  }
}
