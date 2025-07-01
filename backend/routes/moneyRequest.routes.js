import express from "express";
import {
  createMoneyRequest,
  viewMoneyRequests,
  handleMoneyRequest,
  getAccountSummary,
} from "../controllers/moneyRequest.controller.js";
import { isSignedIn } from "../middlewares/user.middlewares.js";

const router = express.Router();

// Create a new money request
router.post("/requestMoney", isSignedIn, createMoneyRequest);

// View all money requests for the logged-in user
router.get("/moneyRequests", isSignedIn, viewMoneyRequests);

// Accept or reject a money request (logs the transaction if accepted)
router.post("/handleRequest", isSignedIn, handleMoneyRequest);



router.get("/accountSummary", isSignedIn, getAccountSummary);



export default router;
