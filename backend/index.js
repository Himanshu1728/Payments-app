import express from 'express';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import UserRoutes from "./routes/user.routes.js";
import AccountRoutes from "./routes/account.routes.js";
import MoneyRequestRoutes from "./routes/moneyRequest.routes.js";
import cors from "cors";
import { isSignedIn } from './middlewares/user.middlewares.js';

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to Database
console.log("MONGO_URI =", process.env.MONGO_URI);
connectDB();

const app = express();

// ✅ CORS Configuration for Vercel
app.use(cors({
  origin: 'https://payments-app-zvjc.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Middleware to parse JSON
app.use(express.json());


// ✅ Test Route (Optional)
app.get("/", (req, res) => {
    res.send("Payments API is running 🚀");
});

// ✅ Routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/account", AccountRoutes);
app.use("/api/v1/moneyrequest", MoneyRequestRoutes);

// ✅ Auth Route
app.get('/api/v1/me', isSignedIn, (req, res) => {
    console.log("hi");
    res.json({ message: 'User authenticated', user: req.user });
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
