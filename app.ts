import express, { Router } from "express";
import cors from "cors";
import AuthRouter from "./routers/auth";

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const APIRouter = Router();
APIRouter.use("/auth", AuthRouter);
app.use("/api", APIRouter);

app.listen(process.env.PORT, () => {
  console.log(`app running in port ${process.env.PORT}`);
});
