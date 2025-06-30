import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import UserRoutes from "./routes/user.routes.js";
import AccountRoutes from "./routes/account.routes.js";
import MoneyRequestRoutes from "./routes/MoneyRequest.routes.js";

import cors from "cors";
import { isSignedIn } from './middlewares/user.middlewares.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/account", AccountRoutes);
app.use("/api/v1/moneyrequest", MoneyRequestRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('Backend is working 🎉');
});

// Authentication check route
app.get('/api/v1/me', isSignedIn, (req, res) => {
    res.json({ message: 'User authenticated', user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
