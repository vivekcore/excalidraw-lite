import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/AsyncApi.js";
import { userServices } from "../services/user.service.js";

export const userController = {
  SignupUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const response = await userServices.SignupUser(data);

      res.status(200).json({
        status: "success",
        message: "user created successfully",
        data: response,
      });
    },
  ),
  LoginUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const response = await userServices.LoginUser(data);

      res.status(200).json({
        status: "success",
        message: "Account Created",
        data: response,
      });
    },
  ),
  UpdateUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = req.body;
      const userId = req.userId;
      const response = await userServices.UpdateUser(data, userId);

      res.status(200).json({
        status: "success",
        message: "Loged In",
        data: response,
      });
    },
  ),
  DeleteUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.userId;
      const response = await userServices.DeleteUser(userId);

      res.status(200).json({
        status: "success",
        message: "Account Deleted",
        data: response,
      });
    },
  ),
};
