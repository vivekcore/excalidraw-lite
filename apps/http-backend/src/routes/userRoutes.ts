import { Request, Response, Router } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { CreateUserSchema } from "@repo/common/types";
import {prisma} from "@repo/db/prisma"
const router: Router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const response = CreateUserSchema.safeParse(data);
    if (!response.success) {
      return res.json({
        message: "Incorrect inputs",
      });
    }
    const { username, name, password } = response.data;
    const user = await prisma.user.create({
      data:{
        name,
        username,
        password,
      }
    })
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const token = jwt.sign({ userId: "121" }, JWT_SECRET);
  res.json({
    token,
  });
});

export default router;
