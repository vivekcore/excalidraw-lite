import { Request, Response, Router } from "express";
import {JWT_SECRET} from '@repo/backend-common/config'
import jwt from "jsonwebtoken"
import {CreateUserSchema} from "@repo/common/types"
const router:Router = Router();

router.post('/signup', async(req:Request, res:Response) => {
    const data = req.body;
    const response = CreateUserSchema.safeParse(data)
    if(!response.success){
        return res.json({
            message:"Incorrect inputs"
        })
    }
   //db call
    res.json({
        status: "success",
        user: {
            
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