import { Router } from "express";
import { Middleware } from "../middleware/authMiddleware.js";
import { roomController } from "../controllers/room.controller.js";
const router: Router = Router();

router.post("/create-room", Middleware, roomController.createRoom);
router.post("/delete",Middleware,roomController.deleteRoom)
router.patch("/update",Middleware,roomController.updateRoom)
router.get("/chats/:roomId",Middleware,roomController.getChatByRoomId);
router.get("/my-rooms",Middleware,roomController.myRooms)
router.get("/:slug",Middleware,roomController.getRoombySlug)
router.get("/shapes/:roomId",Middleware,roomController.getRoomShapes)
export default router;
