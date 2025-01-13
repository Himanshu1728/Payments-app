import express from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import UserRoutes from "./routes/user.routes.js"
import AccountRoutes from "./routes/account.routes.js"
import MoneyRequestRoutes from "./routes/MoneyRequest.routes.js"

import cors from "cors";
import { isSignedIn } from './middlewares/user.middlewares.js';
dotenv.config();
connectDB();
const app=express();
app.use(cors());
app.use(express.json());



app.use("/api/v1/user",UserRoutes);
app.use("/api/v1/account",AccountRoutes);
app.use("/api/v1/moneyrequest",MoneyRequestRoutes);
app.get('/api/v1/me', isSignedIn, (req, res) => {
    console.log("hi");
    res.json({ message: 'User authenticated', user: req.user });
  });
app.listen(process.env.PORT);