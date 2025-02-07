import UserPFP from '@/components/user/UserPFP';
import CommentInteractionBar from '@/Main/Post/components/CommentSection/components/Comments/components/CommentInteractionBar/CommentInteractionBar';
import getRelativeTime from '@/util/getRelativeTime';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { NavigateFunction } from 'react-router-dom';
import { VoteType } from '@/interface/backendTypes';

interface CommentProps {
  comment: DBCommentWithReplies;
  depth: number;
  userId: string | undefined;
  navigate: NavigateFunction;
  onVote: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
}

// TODO: Mark post owner comments as OP
// TODO: Add user flair :)
export default function Comment({
  comment,
  depth,
  userId,
  navigate,
  onVote,
}: CommentProps) {
  const redirectToUser = (username: string) => {
    navigate(`/user/${username}`);
  };

  return (
    <>
      <div
        className="my-4 flex flex-col gap-1"
        style={{ marginLeft: `${depth * 40}px` }}
      >
        <div className="flex items-center gap-1">
          <UserPFP
            url={comment.user?.profile_picture_url ?? null}
            onClick={() =>
              comment.user?.username && redirectToUser(comment.user.username)
            }
          />

          <div>{comment.user?.username}</div>

          <div className="ml-1 text-xs text-gray-secondary">
            • {getRelativeTime(comment.created_at)}
          </div>
        </div>

        <div className="flex">
          <div className="min-w-11"></div>

          <div>
            <div>{comment.content}</div>

            <CommentInteractionBar
              totalVoteCount={comment.total_vote_score}
              userVote={{
                hasVoted: comment?.comment_votes?.[0]?.user_id === userId,
                voteType: comment?.comment_votes?.[0]?.vote_type,
              }}
              commentId={comment.id}
              onVoteComment={onVote}
            />
          </div>
        </div>
      </div>

      {comment.replies?.map((commentReply) => (
        <Comment
          comment={commentReply}
          depth={depth + 1}
          userId={userId}
          navigate={navigate}
          key={commentReply.id}
          onVote={onVote}
        />
      ))}
    </>
  );
}
