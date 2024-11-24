import express, { Router } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

dotenv.config();
const router = Router();

// Hash password utility function
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// get user details

router.get("/", async(req, res)=>{
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded._id
  try {
     const user = await User.findById(userId)

     if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     res.status(200).json({message:"user fetched successfully", user})
  } catch (error) {
     res.status(403).json({message:"Invalid token or some error occured fetchign user details"})
  }
})

// Sign Up Route
router.post("/signUp", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Encrypt the password
    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password:", hashedPassword);

    // Check if user already exists
    const user = await User.findOne({
      $or: [{ name }, { email }],
    });

    if (user) {
      return res.status(400).json({ message: "User already present in DB" });
    }

    // Create a new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Generate a JWT token
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    res.status(200).json({ message: "User created successfully", user:newUser, token });
  } catch (error) {
    res.status(400).json({ message: `Error in creating the user: ${error.message}` });
  }
});

// Sign In Route
router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found with these credentials" });
    }

    console.log("Stored Hash:", user.password);

    // Compare provided password with stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Valid:", isPasswordValid);

    if (isPasswordValid) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    // Create a token and return it
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: `Error during sign-in: ${error.message}` });
  }
});

// admin routes 



export default router;
