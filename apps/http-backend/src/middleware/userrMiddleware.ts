import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const Middleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["authorization"] ?? "";
    if (!token) {
      res.status(403).json({
        message: "token is missing",
      });
      return;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded) {
      req.userId = (decoded as JwtPayload).userId as string;
    }
    next();
  } catch (error) {
    res.status(403).json({
        message:"Unauthrized"+error
    })
  }
};
