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
      'https://project-odin-book-git-main-vincentluchts-projects.vercel.app',
      'https://project-odin-book-sx69c3i53-vincentluchts-projects.vercel.app',
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
