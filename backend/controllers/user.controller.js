import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Account from "../models/account.model.js";


const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  FirstName: z.string().min(1, { message: "First name is required" }),
  LastName: z.string().min(1, { message: "Last name is required" }),
  Password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  Password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const updateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  Password: z.string().min(6, { message: "Current password must be at least 6 characters long" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters long" }).optional(),
});

// Signup Controller
export const signupcontroller = async (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { email, FirstName, LastName, Password } = validation.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }
  
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await User.create({ email, FirstName, LastName, Password: hashedPassword });
    await Account.create({
      userId:newUser._id,
      balance: 1 + Math.random() * 10000
  })
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        FirstName: newUser.FirstName,
        LastName: newUser.LastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};

// Signin Controller
export const signincontroller = async (req, res) => {
  const validation = signinSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { email, Password } = validation.data;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(Password, existingUser.Password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};

// Update User Credentials Controller
export const updateUserCredentials = async (req, res) => {
  const validation = updateUserSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { email, FirstName, LastName, Password, newPassword } = validation.data;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(Password, user.Password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    let updatedFields = { FirstName, LastName };
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedFields.Password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updatedFields },
      { new: true }
    );

    return res.status(200).json({
      message: "User credentials updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        FirstName: updatedUser.FirstName,
        LastName: updatedUser.LastName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};
