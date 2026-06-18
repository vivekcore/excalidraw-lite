import { Shapes } from "./types"

interface InputTypes {
    ctx: CanvasRenderingContext2D
    roomId : string
    socket : WebSocket
    shapeKind : {current: Shapes}
    existingShapes: Shapes[]
}
export class Game {
    private ctx:CanvasRenderingContext2D
    private roomId: string
    private socket: WebSocket
    private shapeKind: {current: Shapes}
    private existingShapes: Shapes[]
    
    constructor({ctx,roomId,socket,shapeKind,existingShapes}:InputTypes) {
        this.ctx = ctx
        this.roomId = roomId
        this.socket = socket
        this.shapeKind = shapeKind
        this.existingShapes = existingShapes
    }
    
}