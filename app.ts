import express, { Router } from "express";
import cors from "cors";
import AuthRouter from "./routers/auth";

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const LicenseRouter = Router();
LicenseRouter.use("/auth", AuthRouter);
app.use("/license", LicenseRouter);

app.listen(process.env.PORT, () => {
  console.log(`app running in port ${process.env.PORT}`);
});
