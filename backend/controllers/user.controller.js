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
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const updateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  FirstName: z.string().optional(),
  LastName: z.string().optional(),
  password: z.string().min(6, { message: "Current password must be at least 6 characters long" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters long" }).optional(),
});

// Signup Controller
export const signupcontroller = async (req, res) => {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { email, FirstName, LastName, password } = validation.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // Corrected here
    const newUser = await User.create({ email, FirstName, LastName, password: hashedPassword });  // Corrected here
    await Account.create({
      userId: newUser._id,
      balance: 1 + Math.random() * 100000
    });

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

  const { email, password } = validation.data;  // Corrected here

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);  // Corrected here
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

  const { email, FirstName, LastName, password, newPassword } = validation.data;  // Corrected here

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);  // Corrected here
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    let updatedFields = { FirstName, LastName };
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedFields.password = hashedPassword;  // Corrected here
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




export const searchUsers = async (req, res) => {
  const filter = req.query.filter || ""; // Only define filter once

  try {
    // Search for users based on the filter in either firstName or lastName
    const users = await User.find({
      $or: [
        { FirstName: { "$regex": filter, "$options": "i" } },  // Case-insensitive regex search
        { LastName: { "$regex": filter, "$options": "i" } }
      ]
    });
console.log(users)
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Format the response to return user details
    res.json({
      users: users.map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error occurred" });
  }
};
