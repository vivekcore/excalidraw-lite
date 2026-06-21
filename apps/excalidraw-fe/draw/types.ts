export type Tshape ="circle" | "rectangle" | "ellipse" | "triangle" | "line" |"pencil"| null;

export type Shapes =
  | {
      type: "rectangle";
      X: number;
      Y: number;
      width: number;
      height: number;
      strokeColor:string
    }
  | {
      type: "circle";
      X: number;
      Y: number;
      radius: number;
      strokeColor:string
    }
  | {
      type: "ellipse";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
      strokeColor:string
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor:string
    }
  | {
      type: "triangle";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor:string
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      strokeColor:string
    };
