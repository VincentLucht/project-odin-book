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
import communityModeratorRouter from '@/communityModerator/communityModeratorRouter';
import postModerationRouter from '@/postModeration/postModerationRouter';
import commentModerationRouter from '@/commentModeration/commentModerationRouter';
import modMailRouter from '@/modMail/modMailRouter';
import reportRouter from '@/report/reportRouter';
import notificationRouter from '@/notification/notificationRouter';
import approvedUsersRouter from '@/approvedUser/approvedUserRouter';
import savedPostsAndCommentsRouter from '@/savedPostAndComments/savedPostsAndCommentsRouter';

import chatRouter from '@/chats/chat/chatRouter';
import messageRouter from '@/chats/message/messageRouter';

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
router.use('/community/mod/comment', commentModerationRouter);
router.use('/community/user/flair', userAssignedFlairRouter);
router.use('/community/mod', communityModeratorRouter);
router.use('/community/mod/post', postModerationRouter);
router.use('/topic', topicRouter);
router.use('/modmail', modMailRouter);
router.use('/report', reportRouter);
router.use('/notification', notificationRouter);
router.use('/community/user/approved', approvedUsersRouter);
router.use('', savedPostsAndCommentsRouter);

router.use('/chat', chatRouter);
router.use('/chat/message', messageRouter);

router.get('/test', (req, res) => {
  return res.json([{ title: 'test' }, { title: 'test2' }]);
});

// catch all route
router.all('*', (req, res) => {
  res.status(404).send('Error, route not found');
});

export default router;