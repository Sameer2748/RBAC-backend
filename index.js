import express from "express"
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoute.js"
import cors from "cors"
const app = express()


app.use(express.json());
app.use(cors());

connectDB()
app.get("/", (req,res)=>{
    res.json({"msg":"hey sameer"})
})

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/admin', adminRoutes)

app.listen(3000, ()=>{
    console.log("listening on por 3000");
})