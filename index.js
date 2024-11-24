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
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not Allowed"), false); // Reject the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Add other HTTP methods you need
  credentials: true, // If you are handling cookies or sessions
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
