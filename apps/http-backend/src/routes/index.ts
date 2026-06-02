import { Router } from "express";
import roomRoutes from "./roomRoutes.js";
import userRoutes  from "./userRoutes.js";
const router:Router = Router();

router.use('/room',roomRoutes);
router.use('/user',userRoutes);

export default router;