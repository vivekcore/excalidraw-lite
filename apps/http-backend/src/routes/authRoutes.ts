import {  Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { Middleware } from "../middleware/authMiddleware.js";
const router: Router = Router();

router.post("/signup", userController.SignupUser);

router.post("/signin", userController.LoginUser);

router.get("/delete", Middleware, userController.DeleteUser);

export default router;

