import { useState } from 'react';

import UserPFP from '@/components/user/UserPFP';
import CommentInteractionBar from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentInteractionBar';
import HideOrShow from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/HideOrShow';
import ReplyEditor from '@/Main/Post/components/ReplyEditor/ReplyEditor';
import MoreRepliesButton from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/MoreRepliesButton/MoreRepliesButton';

import getRelativeTime from '@/util/getRelativeTime';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { NavigateFunction } from 'react-router-dom';
import { VoteType } from '@/interface/backendTypes';
import { TokenUser } from '@/context/auth/AuthProvider';
import './css/comment.css';

interface CommentProps {
  comment: DBCommentWithReplies;
  depth: number;
  user: TokenUser | null;
  token: string | null;
  postId: string;
  originalPoster: string;
  navigate: NavigateFunction;
  onVote: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
}

// TODO: Mark post owner comments as OP <= you were here :)
// TODO: Add user flair :)
// TODO: Add editing comments if you are the creator
// TODO: Add save functionality for comment
export default function Comment({
  comment,
  depth,
  user,
  token,
  postId,
  originalPoster,
  navigate,
  onVote,
  setComments,
  setPost,
}: CommentProps) {
  const [showReply, setShowReply] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [hideReplies, setHideReplies] = useState(false);

  const hasReplyAtAll = comment.replies === undefined && comment._count.replies >= 1;
  const hasReply = comment.replies?.length > 0;

  const redirectToUser = (username: string) => {
    navigate(`/user/${username}`);
  };

  const toggleShow = (wasSubmitted = false) => {
    if (wasSubmitted) {
      setCommentText('');
      setShowReply(false);
      return;
    }

    if (commentText) {
      const cancel = confirm(
        'You have a comment in progress, are you sure you want to discard it?',
      );

      if (cancel) {
        setCommentText('');
        setShowReply(!showReply);
      }
    } else {
      setShowReply(!showReply);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col gap-1 transition-all ${depth >= 8 && hasReplyAtAll && 'comment-active'}`}
        style={{ marginLeft: `${depth * 30}px` }}
      >
        <div className="flex items-center gap-1">
          <div className={`${depth > 0 && 'comment-connector-line'}`}></div>
          <UserPFP
            url={comment.user?.profile_picture_url ?? null}
            onClick={() =>
              comment.user?.username && redirectToUser(comment.user.username)
            }
            classname={`${depth === 0 && '-ml-[2px] mr-[2px]'}`}
          />

          <div>{comment.user?.username}</div>

          {comment.user?.username === originalPoster && (
            <div className="pt-1 text-xs text-blue-500 df">OP</div>
          )}

          <div className="ml-1 text-xs text-gray-secondary">
            • {getRelativeTime(comment.created_at, true)}
          </div>
        </div>

        <div className="flex">
          <div className="grid min-w-11 grid-rows-[1fr_32px]">
            <div className="-mb-[6px] -mt-[3px] df">
              {hasReply && (
                <div className="h-full max-w-[1px] border border-gray-500"></div>
              )}
            </div>

            {hasReply && <HideOrShow hide={hideReplies} setHide={setHideReplies} />}
          </div>

          <div>
            <div
              className={`break-all text-[14.5px] ${depth === 0 ? 'ml-[5px]' : 'ml-[3px]'}`}
            >
              {comment.content}
            </div>

            <CommentInteractionBar
              totalVoteCount={comment.total_vote_score}
              userVote={{
                hasVoted: comment?.comment_votes?.[0]?.user_id === user?.id,
                voteType: comment?.comment_votes?.[0]?.vote_type,
              }}
              commentId={comment.id}
              onVoteComment={onVote}
              toggleShow={toggleShow}
            />
          </div>
        </div>

        <ReplyEditor
          show={showReply}
          repliesHidden={hideReplies}
          depth={depth}
          toggleShow={toggleShow}
          setCommentText={setCommentText}
          commentText={commentText}
          postId={postId}
          commentId={comment.id}
          parentCommentId={comment.id}
          setComments={setComments}
          setPost={setPost}
          user={user}
          token={token}
          isReply={true}
          hasReply={hasReply}
        />

        <MoreRepliesButton
          hasReplyAtAll={hasReplyAtAll}
          parent_comment_id={comment.id}
        />
      </div>

      {!hideReplies && (
        <ul
          className={`${comment.replies?.length > 1 && 'comment'}`}
          style={{ '--left-offset': `${21 + depth * 30}px` } as React.CSSProperties}
        >
          {comment.replies?.map((commentReply) => (
            <li key={commentReply.id}>
              <Comment
                comment={commentReply}
                depth={depth + 1}
                user={user}
                token={token}
                postId={postId}
                originalPoster={originalPoster}
                navigate={navigate}
                key={commentReply.id}
                onVote={onVote}
                setComments={setComments}
                setPost={setPost}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
