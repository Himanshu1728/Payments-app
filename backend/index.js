import express from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db.js';
import UserRoutes from "./routes/user.routes.js"
const app=express.app();
connectDB();
app.use("/api/v1/user",UserRoutes);
app.listen(process.env.PORT);