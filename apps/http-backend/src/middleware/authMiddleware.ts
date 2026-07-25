import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { ForbiddenError } from "@repo/db/error";

export const Middleware = (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers["authorization"];
  if (!headers) {
    return next(new ForbiddenError("token is missing"));
  }
  const token = headers.split(" ")[1];
  if (!token) {
    return next(new ForbiddenError("token is missing"));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded) {
      req.userId = (decoded as JwtPayload).userId as string;
    }
    next();
  } catch (error) {
    return next(new ForbiddenError("Unauthorized"));
  }
};
