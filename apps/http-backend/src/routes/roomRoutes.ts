import { Request, Response, Router } from "express";
import { Middleware } from "../middleware/userrMiddleware.js";
import { prisma } from "@repo/db";
import { GenerateSlug } from "../utils/slug.js";
const router: Router = Router();

router.post("/create-room", Middleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const slug = GenerateSlug();
    const room = await prisma.room.create({
      data: {
        slug: (await slug).toString(),
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
      orderBy: {
        id: "desc",
      },
      take: 50,
    });
    res.status(200).json({
      status: "success",
      data: message,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});
router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.query.slug as string;
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
export default router;
