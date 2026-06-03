import { Request, Response, Router } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SignSchema } from "@repo/common/types";
import { prisma } from "@repo/db/prisma";
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
    const { name, password, email } = response.data;
    const existUser = await prisma.user.findUnique({
      where:{
        email,
      }
    })
    if(existUser){
      return res.status(411).json({
        message:"Email already regestered try signIn instead"
      })
    }
    const user = await prisma.user.create({
      data:{
        name,
        password,
        email,
      }
    });
    res.json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(400).json({
      Error: error,
    });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const response = SignSchema.safeParse(req.body);
    if (!response.success) {
      return res.status(403).json({
        messaage: "Invalid inputs",
      });
    }
    const { email, password } = response.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
        password,
      },
    });
    if (!user) {
      return res.json({
        message: "Invalid username or password",
      });
    }
    const payload = { userId: user?.id };
    const token = jwt.sign(payload, JWT_SECRET);

    res.json({
      status: "success",
      message: "sign sucessfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      Errro: error,
    });
  }
});

export default router;
