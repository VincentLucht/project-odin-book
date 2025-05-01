import useClickOutside from '@/hooks/useClickOutside';
import usePostModerationCommunity from '@/Main/Post/components/PostInteractionBar/components/hook/usePostModerationCommunity';
import usePostModerationPost from '@/Main/Post/hooks/usePostModerationPost';

import Upvote from '@/components/Interaction/Upvote';
import Downvote from '@/components/Interaction/Downvote';
import Reply from '@/components/Interaction/Reply';
import Share from '@/components/Interaction/Share';
import ModMenuPost from '@/Main/Post/components/PostInteractionBar/components/ModMenuPost';

import { VoteType } from '@/interface/backendTypes';
import {
  DBPostModeration,
  DBPostWithCommunityName,
  DBPostWithCommunity,
  PostAssignedFlair,
} from '@/interface/dbSchema';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

interface PostInteractionBarProps {
  post: {
    id: string;
    total_vote_score: number;
    total_comment_score: number;
    is_mature: boolean;
    is_spoiler: boolean;
    lock_comments?: boolean;
    moderation?: DBPostModeration;
    community: { id: string; name: string };
    post_assigned_flair: PostAssignedFlair;
  };
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  token: string | null;
  userVote: { hasVoted: boolean; voteType: VoteType | undefined };
  onVote: (voteType: VoteType) => void;
  postRedirect?: () => void;
  mode?: 'post' | 'overview';
  showModOptions?: boolean;
  isMod?: IsMod;
  showEditDropdown?: string | null;
  setShowEditDropdown?: React.Dispatch<React.SetStateAction<string | null>>;
  showModDropdown?: string | null;
  setShowModDropdown?: React.Dispatch<React.SetStateAction<string | null>>;
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
}

export default function PostInteractionBar({
  post,
  setPosts,
  setPost,
  token,
  userVote,
  onVote,
  postRedirect,
  mode = 'overview',
  showModOptions = false, // TODO: Remove? Good to have, but unused
  isMod = false,
  showEditDropdown,
  setShowEditDropdown,
  showModDropdown,
  setShowModDropdown,
  onModerationCb,
}: PostInteractionBarProps) {
  const { total_vote_score, total_comment_score } = post;

  const isUpvote = userVote?.voteType === 'UPVOTE';
  const isDownVote = userVote?.voteType === 'DOWNVOTE';

  useClickOutside(() => {
    setShowModDropdown?.(null);
  });

  const communityHooks = usePostModerationCommunity(setPosts);
  const singlePostHooks = usePostModerationPost(setPost);

  // Choose hook results based on mode
  const {
    onApproveComplete,
    onRemoveComplete,
    onLockCommentsComplete,
    onUpdateNSFWComplete,
    onUpdateSpoilerComplete,
    onUpdateRemovalReason,
  } = mode === 'post' ? singlePostHooks : communityHooks;

  return (
    <div className="flex h-8 items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`interaction-button-wrapper
            ${userVote.voteType ? (isUpvote ? '!bg-orange-500' : '!bg-purple-500') : ''}`}
        >
          <Upvote
            isActive={userVote.hasVoted && isUpvote}
            isOtherActive={isDownVote}
            onVote={onVote}
          />

          {/* TODO: Really change this to not visible?? */}
          <span className="-mx-[2px] text-sm font-medium">
            {total_vote_score <= 0 ? 0 : total_vote_score}
          </span>

          <Downvote
            isActive={userVote.hasVoted && isDownVote}
            isOtherActive={isUpvote}
            onVote={onVote}
          />
        </div>

        <Reply totalCommentCount={total_comment_score} onClick={postRedirect} />

        <Share mode={mode && mode} />
      </div>

      {showModOptions && isMod && (
        <ModMenuPost
          post={{ ...post }}
          setPost={setPost}
          token={token}
          showEditDropdown={showEditDropdown}
          setShowEditDropdown={setShowEditDropdown}
          showModDropdown={showModDropdown}
          setShowModDropdown={setShowModDropdown}
          isMod={isMod}
          onApproveComplete={onApproveComplete}
          onRemoveComplete={onRemoveComplete}
          onLockCommentsComplete={onLockCommentsComplete}
          onUpdateNSFWComplete={onUpdateNSFWComplete}
          onUpdateSpoilerComplete={onUpdateSpoilerComplete}
          onUpdateRemovalReason={onUpdateRemovalReason}
          onModerationCb={onModerationCb}
        />
      )}
    </div>
  );
}
