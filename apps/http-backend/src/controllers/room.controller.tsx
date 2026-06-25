import { NextFunction, Response, Request } from "express";
import { catchAsync } from "../utils/AsyncApi.js";
import { roomServices } from "../services/room.services.js";

export const roomController = {
  createRoom: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.userId;
      const name = req.body.name;
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
      const response = await roomServices.updateRoom(userId, name);

      res.status(200).json({
        status: "success",
        message: "Room Created",
        data: response,
      });
    },
  ),
  deleteRoom: catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    const userId = req.userId
    const response = await roomServices.deleteRoom(userId)

    res.status(200).json({
        status:"success",
        message:"Room Deleted",
        data:response
    })
  })
};
