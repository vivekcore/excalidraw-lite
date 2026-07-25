import express from "express";
import rootRouter from "./routes/index.js";
import cors from "cors";
import { errorHandler } from "./middleware/globalErrorMiddleware.js";
import { limiter } from "./config.js";
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4000',
  credentials:true
}));
const startServer = () => {
  try {
    app.use("/api/v1",limiter, rootRouter);

    app.use(errorHandler);
    app.listen(8000, () => {
      console.log("server is runnig at port 8000");
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
