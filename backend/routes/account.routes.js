import express from 'express';
import { transferFunds } from '../controllers/account.controller.js';
import { isSignedIn } from '../middlewares/user.middlewares.js';

const router=express.Router();
router.post("/transaction",isSignedIn,transferFunds);
router.get("/getBalance",isSignedIn,transferFunds);
export default router;