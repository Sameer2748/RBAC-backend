import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectDB = async()=>{
    const url = `${process.env.MONGODB_URI}/rbac-demo`;
    console.log(url);
    try {
        const connection = await mongoose.connect(url);
        
    } catch (error) {
        console.log("Mongodb connection failed",error.message);
    }
};

export default connectDB;