import "dotenv/config";
import express, { Request, Response } from "express";
import rootRouter from "./routes/index.js";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());
const startServer = () => {
  try {
    app.use("/api/v1", rootRouter);
    app.get("/", async (req: Request, res: Response) => {
      res.status(200).json({
        message: "http baackend is running",
      });
    });

    app.listen(8000, () => {
      console.log("server is runnig at port 8000");
    });
  } catch (error) {
    console.log(error)
  }
};
startServer();