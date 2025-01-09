import express from 'express';
import dotenv from 'dotenv'
import connectDB from './utils/db';
const app=express.app();
connectDB();

app.listen(process.env.PORT);