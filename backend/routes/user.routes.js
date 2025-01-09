import express from 'express';
import { signincontroller, signupcontroller, updateUserCredentials } from '../controllers/user.controller';
import { isSignedIn } from '../middlewares/user.middlewares';
const router=express.Router();
router.post("/signup",signupcontroller);
router.post("/signin",signincontroller);
router.put("/update",isSignedIn,updateUserCredentials);
export default router;