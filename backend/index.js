import express from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import UserRoutes from "./routes/user.routes.js"
import AccountRoutes from "./routes/account.routes.js"
import cors from "cors";
dotenv.config();
connectDB();
const app=express();
app.use(cors());
app.use(express.json());


app.use("/api/v1/user",UserRoutes);
app.use("/api/v1/account",AccountRoutes);
app.listen(process.env.PORT);