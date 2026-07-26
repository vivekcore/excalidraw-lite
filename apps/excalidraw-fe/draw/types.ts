export type Tshape =
  | "circle"
  | "rectangle"
  | "ellipse"
  | "triangle"
  | "line"
  | "pencil"
  | null;

export type Shapes =
  | {
      id:string;
      type: "rectangle";
      X: number;
      Y: number;
      width: number;
      height: number;
      strokeColor: string;
    }
  | {
    id:string;
      type: "ellipse";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      strokeColor: string;
    }
  | {
    id:string;
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor: string;
    }
  | {
    id:string;
      type: "triangle";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor: string;
    }
  | {
    id:string;
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor: string;
    };

export interface ApiRes {
  id: string;
  roomId: number;
  userId: string;
  data: string;
  createdAt: Date;
}
