import {  Router } from "express";
import { Middleware } from "../middleware/userrMiddleware.js";
import { userController } from "../controllers/user.controller.js";
const router: Router = Router();

router.post("/signup", userController.SignupUser);

router.post("/signin", userController.LoginUser);

router.get("/delete", Middleware, userController.DeleteUser);

export default router;

