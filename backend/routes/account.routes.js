import express from 'express';
import { addBalance, getbalance, transferFunds } from '../controllers/account.controller.js';
import { isSignedIn } from '../middlewares/user.middlewares.js';

const router=express.Router();
router.post("/transaction",isSignedIn,transferFunds);
router.get("/getBalance",isSignedIn,getbalance);
router.get("/addBalance",isSignedIn,addBalance);
export default router;