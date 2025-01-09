import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupcontroller = async (req, res) => {
  const { email, FirstName, LastName, Password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new user
    const newUser = await User.create({
      email,
      FirstName,
      LastName,
      Password: hashedPassword,
    });

    // Respond with success
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

export const signincontroller = async (req, res) => {
  const { email, Password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // Validate the password
    const isPasswordCorrect = await bcrypt.compare(Password, existingUser.Password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    // Generate a token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } 
    );

    // Respond with success
    return res.status(200).json({
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred" });
  }
};


export const updateUserCredentials = async (req, res) => {
    const { email, FirstName, LastName, Password, newPassword } = req.body;
  
    try {
     
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      const isPasswordCorrect = await bcrypt.compare(Password, user.Password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
  
      // Hash the new password, if provided
      let updatedFields = { FirstName, LastName }; // Fields to update
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updatedFields.Password = hashedPassword;
      }
  
      // Update user in the database
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: updatedFields },
        { new: true } // Return the updated user
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
    const name = req.query.filter;
    const [firstname, lastName] = name.split("%20");  // Splitting the string by space ("%20")
  
    try {
      // MongoDB query to find users with the matching FirstName or LastName
      const user = await User.find({
        $or: [{ FirstName: firstname }, { LastName: lastName }],
      }).select('-password');  // Excluding the password field
  
      if (user.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      return res.status(200).json({
        users: user,
        message: "Users successfully fetched",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred" });
    }
  };
  