export type Shapes =
  | {
      type: "rectangle";
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
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "triangle";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };
