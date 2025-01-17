import express from 'express';
import authRouter from '@/auth/authRouter';
import communityRouter from '@/community/communityRouter';
import userCommunityRouter from '@/userCommunity/userCommunityRouter';
import communityFlairRouter from '@/communityFlair/communityFlairRouter';
import postRouter from '@/post/postRouter';
import postVoteRouter from '@/postVote/postVoteRouter';
import commentRouter from '@/comment/commentRouter';
import commentVoteRouter from '@/commentVote/commentVoteRouter';
import userAssignedFlairRouter from '@/userAssignedFlair/userAssignedFlairRouter';
import postAssignedFlairRouter from '@/postAssignedFlair/postAssignedFlairRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/community', communityRouter);
router.use('/community', userCommunityRouter);
router.use('/community/flair', communityFlairRouter);
router.use('/community/post', postRouter);
router.use('/community/post/vote', postVoteRouter);
router.use('/community/post/flair', postAssignedFlairRouter);
router.use('/community/post/comment', commentRouter);
router.use('/community/post/comment/vote', commentVoteRouter);
router.use('/community/user/flair', userAssignedFlairRouter);

router.get('/test', (req, res) => {
  return res.json([{ title: 'test' }, { title: 'test2' }]);
});

// catch all route
router.all('*', (req, res) => {
  res.status(404).send('Error, route not found');
});

export default router;
