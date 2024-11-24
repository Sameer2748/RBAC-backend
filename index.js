import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoute.js";

const app = express();

// Allow requests from localhost during development
const allowedOrigins = [
  "http://localhost:5173", // Change this to your frontend URL during development
  "https://your-production-frontend-domain.com" // Add your production frontend URL here
];
const corsOptions = {
    origin: "http://localhost:5173", // Allow your frontend's origin
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
    credentials: true, // Allow cookies and authorization headers
};

app.use(cors(corsOptions)); // Use the configured CORS middleware

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ msg: "hey sameer" });
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
