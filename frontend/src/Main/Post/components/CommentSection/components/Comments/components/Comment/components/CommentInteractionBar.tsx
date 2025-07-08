import Upvote from '@/components/Interaction/Upvote';
import Downvote from '@/components/Interaction/Downvote';
import Reply from '@/components/Interaction/Reply';
import Share from '@/components/Interaction/Share';
import Ellipsis from '@/components/Interaction/Ellipsis';
import ModMenuComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/ModMenuComment';
import NotUserEllipsis from '@/components/Interaction/NotUserEllipsis';

import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

import { VoteType } from '@/interface/backendTypes';
import { UrlItems } from '@/components/Interaction/Share';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';
import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBCommentModeration } from '@/interface/dbSchema';

interface CommentInteractionBarProps {
  totalVoteCount: number;
  userVote: { hasVoted: boolean; voteType: VoteType | undefined };
  commentId: string;
  moderation: DBCommentModeration | null;
  setComments?: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  isDeleted: boolean;
  onVoteComment: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
  onDeleteComment: (commentId: string) => void;
  manageSaveFunc: (action: boolean) => void;
  toggleShow: () => void;
  isUserSelf: boolean;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  showModDropdown: string | null;
  setShowModDropdown?: React.Dispatch<React.SetStateAction<string | null>>;
  isEditActive: boolean;
  setIsEditActive?: React.Dispatch<React.SetStateAction<boolean>>;
  urlItems?: UrlItems;
  onEdit?: () => void;
  isLocked?: boolean;
  isMod: IsMod;
  token: string | null;
  hasReported: boolean;
  isMobile: boolean;
  isSaved: boolean;
  isLast?: boolean;
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
}

export default function CommentInteractionBar({
  totalVoteCount,
  userVote,
  commentId,
  moderation,
  setComments,
  isDeleted,
  onVoteComment,
  onDeleteComment,
  manageSaveFunc,
  toggleShow,
  isUserSelf,
  showDropdown,
  setShowDropdown,
  showModDropdown,
  setShowModDropdown,
  isEditActive,
  setIsEditActive,
  urlItems,
  onEdit,
  isLocked,
  isMod,
  token,
  hasReported,
  isMobile,
  isSaved,
  isLast,
  onModerationCb,
}: CommentInteractionBarProps) {
  const isUpvote = userVote?.voteType === 'UPVOTE';
  const isDownVote = userVote?.voteType === 'DOWNVOTE';

  return !isEditActive ? (
    <div className={`-ml-[2px] pt-1 ${isEditActive ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex h-8 items-center justify-between">
        <div className="flex items-center md:gap-1">
          <div className="flex h-8 items-center gap-1 rounded-full">
            <Upvote
              isActive={userVote.hasVoted && isUpvote}
              isOtherActive={isDownVote}
              mode="comment"
              commentId={commentId}
              onVoteComment={onVoteComment}
              previousVoteType={userVote.voteType}
            />

            <span className="-mx-[2px] text-sm font-medium text-gray-400">
              {formatCount(totalVoteCount)}
            </span>

            <Downvote
              isActive={userVote.hasVoted && isDownVote}
              isOtherActive={isUpvote}
              mode="comment"
              commentId={commentId}
              onVoteComment={onVoteComment}
              previousVoteType={userVote.voteType}
            />
          </div>

          {!isLocked && !isLocked && (
            <div onClick={() => toggleShow()}>
              <Reply mode="comment" smallMode={isMobile} />
            </div>
          )}

          <Share
            mode="comment"
            commentId={commentId}
            urlItems={urlItems}
            smallMode={isMobile}
          />

          {!isDeleted &&
            (isUserSelf ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Ellipsis
                  token={token}
                  isUserSelf={isUserSelf}
                  mode="comment"
                  id={commentId}
                  showDropdown={showDropdown}
                  isLast={isLast}
                  setShowDropdown={setShowDropdown}
                  setIsEditActive={setIsEditActive && setIsEditActive}
                  deleteFunc={onDeleteComment}
                  editFunc={onEdit}
                  manageSaveFunc={manageSaveFunc}
                  isSaved={isSaved}
                />
              </div>
            ) : (
              <NotUserEllipsis
                hasReported={hasReported}
                token={token}
                id={commentId}
                mode="comment"
                isLast={isLast}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                setComments={setComments}
                isSaved={isSaved}
                manageSaveFunc={manageSaveFunc}
              />
            ))}
        </div>

        {isMod && (
          <ModMenuComment
            commentId={commentId}
            moderation={moderation}
            setComments={setComments}
            isMod={isMod}
            token={token}
            showEditDropdown={showDropdown}
            setShowEditDropdown={setShowDropdown}
            showModDropdown={showModDropdown}
            setShowModDropdown={setShowModDropdown}
            onModerationCb={onModerationCb}
            isLast={isLast}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  ) : (
    <div className="h-[32px]"></div>
  );
}
