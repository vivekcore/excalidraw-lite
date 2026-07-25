import { Router } from "express";
import roomRoutes from "./roomRoutes.js";
import userRoutes  from "./authRoutes.js";
const router:Router = Router();

router.use('/room',roomRoutes);
router.use('/auth',userRoutes);

export default router;