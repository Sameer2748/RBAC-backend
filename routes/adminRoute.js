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
    const adminuser = await User.findById(userId)
      if(adminuser.role !== "Admin"){
        return res.status(404).json({ message: 'Not Admin' });
      }
     const user = await User.find()

     if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     res.status(200).json({message:"user fetched successfully", user})
  } catch (error) {
     res.status(403).json({message:"Invalid token or some error occured fetchign user details"})
  }
})


router.post('/update', async(req,res)=>{
    const {userId, role, status} = req.body;
    console.log(req.body);
    const token = req.headers['authorization'];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_Id = decoded._id
  
  try {
      const adminuser = await User.findById(user_Id)
      if(adminuser.role !== "Admin"){
        return res.status(404).json({ message: 'Not Admin' });
      }

      const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(role)  user.role = role
        if(status) user.status = status

        await user.save();

        res.status(200).json({ message:"upddated successfukky", user})
    } catch (error) {
        res.json({error: error})
    }
})


router.post("/delete", async(req,res)=>{
  const { userId } = req.body;
  const token = req.headers['authorization'];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user_Id = decoded._id

  try {
      const adminuser = await User.findById(user_Id)
      if(adminuser.role !== "Admin"){
        return res.status(404).json({ message: 'Not Admin' });
      }

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message:"Deleted successfully", user})
  } catch (error) {
      res.json({error: error})
  }
})

export default router;
