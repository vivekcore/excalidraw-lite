import { Request, Response, Router } from "express";
import { Middleware } from "../middleware/userrMiddleware.js";
import { prisma } from "@repo/db";
import { GenerateSlug } from "../utils/slug.js";
const router: Router = Router();

router.post("/create-room", Middleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const name = req.body.name;
    const slug = GenerateSlug();
   const cSlug = (await slug).toString();
    const room = await prisma.room.create({
      data: {
        slug: cSlug,
        name: name || "Untitled",
        adminId: userId,
      },
    });
    res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      Error: error,
    });
  }
});
router.get("/chats/:roomId", async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const message = await prisma.chat.findMany({
      where: {
        roomId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    const messages = message.map((m) => {return m.message})
    res.status(200).json({
      status: "success",
      data: messages
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const room = await prisma.room.findFirst({
      where: {
        slug,
      },
    });
    res.status(200).json({
      status: "success",
      data: room,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
router.get("/my-rooms",async(req:Request,res:Response) => {
  try {
    const userId = req.userId;
    const room = await prisma.room.findMany({
      where:{
        adminId:userId
      }
    })
    res.status(200).json({
      status:"success",
      data:room
    })
  } catch (error) {
    res.json({
      error
    })
  }
})
export default router;
