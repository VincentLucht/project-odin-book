import express from 'express';
import authRouter from '@/auth/authRouter';
import userRouter from '@/user/userRouter';
import communityRouter from '@/community/communityRouter';
import userCommunityRouter from '@/userCommunity/userCommunityRouter';
import communityFlairRouter from '@/communityFlair/communityFlairRouter';
import postRouter from '@/post/postRouter';
import postVoteRouter from '@/postVote/postVoteRouter';
import commentRouter from '@/comment/commentRouter';
import commentVoteRouter from '@/commentVote/commentVoteRouter';
import userAssignedFlairRouter from '@/userAssignedFlair/userAssignedFlairRouter';
import postAssignedFlairRouter from '@/postAssignedFlair/postAssignedFlairRouter';
import recentCommunitiesRouter from '@/recentCommunities/recentCommunitiesRouter';
import topicRouter from '@/topic/topicRouter';
import joinRequestRouter from '@/joinRequest/joinRequestRouter';
import searchResultsRouter from '@/searchResults/searchResultsRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/search', searchResultsRouter);
router.use('/user', userRouter);
router.use('/user/recent-communities', recentCommunitiesRouter);
router.use('/community', userCommunityRouter);
router.use('', communityRouter);
router.use('/community/join-request', joinRequestRouter);
router.use('/community/flair', communityFlairRouter);
router.use('/post', postRouter);
router.use('/community/post/vote', postVoteRouter);
router.use('/community/post/flair', postAssignedFlairRouter);
router.use('/comment', commentRouter);
router.use('/comment/vote', commentVoteRouter);
router.use('/community/user/flair', userAssignedFlairRouter);
router.use('/topic', topicRouter);

router.get('/test', (req, res) => {
  return res.json([{ title: 'test' }, { title: 'test2' }]);
});

// catch all route
router.all('*', (req, res) => {
  res.status(404).send('Error, route not found');
});

export default router;
