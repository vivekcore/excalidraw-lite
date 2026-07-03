import { NextFunction, Response, Request } from "express";
import { catchAsync } from "../utils/AsyncApi.js";
import { roomServices } from "../services/room.services.js";

export const roomController = {
  createRoom: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.userId;
      const name = req.body.name || 'Untitled';
      const response = await roomServices.createRoom(userId, name);

      res.status(200).json({
        status: "success",
        message: "Room Created",
        data: response,
      });
    },
  ),
  updateRoom: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.userId;
      const name = req.body.name;
      const roomId = Number( req.body.roomId)
      const response = await roomServices.updateRoom(userId, name,roomId);

      res.status(200).json({
        status: "success",
        message: "Room Created",
        data: response,
      });
    },
  ),
  deleteRoom: catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const userId = req.userId
    const roomId = Number( req.body.roomId)
    const response = await roomServices.deleteRoom(userId,roomId)

    res.status(200).json({
        status:"success",
        message:"Room Deleted",
        data:response
    })
  }),
  myRooms: catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const userId = req.userId
    const response = await roomServices.myRooms(userId)
    res.status(200).json({
        status:"success",
        message:"My Rooms",
        data:response
    })
  } ),
  getChatByRoomId: catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const roomId = Number(req.params.roomId)
    const userId = req.userId
    const response = await roomServices.getChatByRoomId(userId,roomId)
  
   res.status(200).json({
        status:"success",
        message:"Room Chats",
        data:response
    })
}),
  getRoombySlug: catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const slug = req.params.slug as string
    const userId = req.userId

    const response = await roomServices.getRoomBySlug(userId,slug)
     res.status(200).json({
        status:"success",
        message:"Room By Slug",
        data:response
    })
  } ),
}
