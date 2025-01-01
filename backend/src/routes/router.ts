import express from 'express';
import authRouter from '@/auth/authRouter';

const router = express.Router();

router.use('/auth', authRouter);

router.get('/test', (req, res) => {
  return res.json([{ title: 'test' }, { title: 'test2' }]);
});

// catch all route
router.get('*', (req, res) => {
  res.status(404).send('Error, route not found');
});

export default router;
