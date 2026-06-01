import { Request, Response, Router } from "express";
 import { JWT_SECRET } from "../utils/config";
import jwt from "jsonwebtoken"
const router:Router = Router();

router.post('/signup', async(req:Request, res:Response) => {
    const {name,email,password} = req.body;
   //db call
    res.json({
        status: "success",
        user: {
            name,
            email,
            password
        }
    })
})

router.post('/signin', async (req:Request, res:Response) => {
    const {email,password} = req.body;
    
    const token=jwt.sign({userId: "121"},JWT_SECRET);
    res.json({
        token,
    })
})


export default router;