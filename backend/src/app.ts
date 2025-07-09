import * as dotenv from 'dotenv';
dotenv.config();
import router from '@/routes/router';
import express from 'express';
import cors from 'cors';
const app = express();

// Configure CORS globally
app.use(
  cors({
    origin(origin, callback) {
      console.log('CORS Origin:', origin); // Debug line

      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.includes('localhost')) return callback(null, true);

      // Allow all Vercel domains for your project
      if (
        origin.includes('project-odin-book') &&
        origin.includes('vercel.app')
      ) {
        return callback(null, true);
      }

      // Reject other origins
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json()); // ? parse JSON bodies
app.use(express.urlencoded({ extended: true })); // ? allow req.body

app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on Port 3000');
});
