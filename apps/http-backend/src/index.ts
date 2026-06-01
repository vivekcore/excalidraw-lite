import express, { Request, Response } from "express";
const app = express();
app.use(express.json());

app.get("/",async (req:Request,res:Response) => {
    res.status(200).json({
        message:"http baackend is running"
    })
})

app.listen(8000,() => {
    console.log("server is runnig at port 8000")
})