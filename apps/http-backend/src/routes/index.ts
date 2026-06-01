import { Router } from "express";
import roomRoutes from "./roomRoutes";
import userRoutes  from "./userRoutes";
const router:Router = Router();

router.use('/room',roomRoutes);
router.use('/user',userRoutes);

export default router;