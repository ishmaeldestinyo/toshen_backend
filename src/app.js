import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rootRoutes from "./routes/rootRoutes.js";
import dbConnection from "../config/dbConnection.js";

const PORT = process.env.SERVER_PORT || 3500;

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
    cors({
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly list allowed methods
      origin: [
        "http://localhost:3000",
        "http://localhost:5173", // Fix typo: "http:localhost:5173" -> "http://localhost:5173"
        "https://toshen-backend.onrender.com",
        "https://toshel-frontend.vercel.app",
      ],
      credentials: true, // Allow cookies if needed
      optionsSuccessStatus: 200, // Handle preflight success
    })
  );

app.options("*", cors()); // Enable CORS for preflight requests

app.use(helmet());

app.use(compression());

app.use(cookieParser(process.env.COOKIE_SECRET));

rootRoutes(app);

app.use((req, res, next) =>
  res.status(404).json({ message: "Endpoint not found!" })
);

app.listen(PORT, async () => {
  await dbConnection();

  console.log(`Server is running at port ${PORT}`);
});
