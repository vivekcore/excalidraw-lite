import { api } from "@/lib/axios";
import { ApiRes, Shapes } from "./types";
import { Tshape } from "./types";
import { Listener } from "@/hooks/useWebSocket";

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
  private subscribe: (topic: string, fn: Listener) => () => void;
  private ussub?: () => void;
  private sendMessage: (data: string) => void;
  private destroyed: boolean;
  constructor(
    canvas: HTMLCanvasElement,
    roomId: string,
    strokeColor: { current: string },
    shapeKind: { current: Tshape },
    subscribe: (topic: string, fn: Listener) => () => void,
    sendMessage: (data: string) => void,
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
    this.clicked = clicked;
    this.startX = startX;
    this.startY = startY;
    this.sendMessage = sendMessage;
    this.subscribe = subscribe;
    this.destroyed = false;
    this.init();
    this.socketMessage();
    this.initMouseEvents();
  }
  socketMessage() {
    this.ussub = this.subscribe("shape:create", (data) => {
      const parserShape = JSON.parse(JSON.stringify(data.shape));
      console.log("subscribed");
      this.existingShapes.push(parserShape);
      this.ClearCanvas();
    });
  }
  async init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (!this.ctx) return;

    this.existingShapes = await this.getShapes();
    if (this.destroyed) return;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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
      const response = await api.get(`/room/shapes/${this.roomId}`);
      const data = response.data.data as [];
      console.log(data);
      const parse = data.map((e: ApiRes) => JSON.parse(e.data));
      return parse;
    } catch (error) {
      console.log(JSON.stringify(error));
      return [];
    }
  }
  initMouseEvents() {
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
  }
  destroy() {
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    this.destroyed = true;
    this.ussub?.();
    this.ussub = undefined;
  }

  private onMouseDown = (e: MouseEvent) => {
    this.clicked = true;
    this.ctx.strokeStyle = this.strokeColor.current;
    this.startX = e.offsetX;
    this.startY = e.offsetY;
  };
  private onMouseUp = (e: MouseEvent) => {
    this.clicked = false;
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;
    this.ctx.strokeStyle = this.strokeColor.current;
    switch (this.shapeKind.current) {
      case "rectangle":
        this.BroadCastRectangle(width, height);
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
  };
  private onMouseMove = (e: MouseEvent) => {
    if (this.clicked === false) return;
    const width = e.offsetX - this.startX;
    const height = e.offsetY - this.startY;
    if (this.shapeKind.current !== "pencil") this.ClearCanvas();

    this.ctx.strokeStyle = this.strokeColor.current;
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
        break;
      default:
        break;
    }
    this.ctx.stroke();
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
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    const shape: Shapes = {
      type: "line",
      strokeColor: this.strokeColor.current,
      startX: this.startX,
      startY: this.startY,
      endX: offsetX,
      endY: offsetY,
    };
    this.existingShapes.push(shape);
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
    const data = JSON.stringify({
      type: "shape:create",
      roomId: this.roomId,
      shape: JSON.stringify(shape),
    });
    this.sendMessage(data);
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
    const data = JSON.stringify({
      type: "shape:create",
      roomId: this.roomId,
      shape: JSON.stringify(shape),
    });
    this.sendMessage(data);
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
    const data = JSON.stringify({
      type: "shape:create",
      roomId: this.roomId,
      shape: JSON.stringify(shape),
    });
    this.sendMessage(data);
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
    const data = JSON.stringify({
      type: "shape:create",
      roomId: this.roomId,
      shape: JSON.stringify(shape),
    });
    this.sendMessage(data);
  }
}
