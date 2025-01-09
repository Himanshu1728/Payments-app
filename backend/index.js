import express from 'express';
import dotenv from 'dotenv'
const app=express.app();

app.listen(process.env.PORT);