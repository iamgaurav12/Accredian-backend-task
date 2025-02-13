import express, { Request, Response} from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import referralRoutes from './routes/referral.route';

dotenv.config();

const app = express();
// Allow only the Vercel frontend to access your backend
// const corsOptions = {
//   origin: "https://accredian-frontend-task-pink.vercel.app", // Replace with your actual Vercel URL
//   methods: ["GET", "POST"], // You can add other HTTP methods if needed
// };

// app.use(cors(corsOptions));
app.use(cors({ origin: "*" }));


const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use('/api/referral', referralRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

interface CustomError extends Error {
  statusCode?: number;
}

//Error-Handling Middleware
app.use((err: CustomError, req: Request, res: Response, next: Function) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
  
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });
