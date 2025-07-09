import * as dotenv from 'dotenv';
dotenv.config();
import router from '@/routes/router';
import express from 'express';
import cors from 'cors';
const app = express();

// Configure CORS globally
app.use(
  cors({
    origin: [
      'https://project-odin-book-mocha.vercel.app',
      'http://localhost:3000',
    ],
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
