import express, { Request, Response} from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import referralRoutes from './routes/referral.route';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'https://accredian-frontend-task-9glo3v9iz-gaurav-prakashs-projects.vercel.app/',
   methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());


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
