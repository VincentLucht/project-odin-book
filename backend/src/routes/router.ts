import express from 'express';
import authRouter from '@/auth/authRouter';
import communityRouter from '@/community/communityRouter';
import userCommunityRouter from '@/userCommunity/userCommunityRouter';
import communityFlairRouter from '@/flair/communityFlairRouter';
import postRouter from '@/post/postRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/community', communityRouter);
router.use('/community', userCommunityRouter);
router.use('/community/flair', communityFlairRouter);
router.use('/community', postRouter);

router.get('/test', (req, res) => {
  return res.json([{ title: 'test' }, { title: 'test2' }]);
});

// catch all route
router.get('*', (req, res) => {
  res.status(404).send('Error, route not found');
});

export default router;
