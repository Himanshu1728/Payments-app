import express from 'express';
import { signincontroller, signupcontroller, updateUserCredentials } from '../controllers/user.controller.js';
import { isSignedIn } from '../middlewares/user.middlewares.js';
const router=express.Router();
router.post("/signup",signupcontroller);
router.post("/signin",signincontroller);
router.put("/update",isSignedIn,updateUserCredentials);
export default router;