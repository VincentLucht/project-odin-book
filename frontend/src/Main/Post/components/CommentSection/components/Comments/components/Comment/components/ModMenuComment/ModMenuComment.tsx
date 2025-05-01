import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import useCommentModeration from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/hooks/useCommentModeration';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import ModMenuButton from '@/components/Interaction/ModMenuButton';
import ModerationTag from '@/Main/Post/components/tags/common/ModerationTag';
import { CheckIcon, PlusIcon } from 'lucide-react';

import { moderateComment } from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/api/commentModerationAPI';

import { IsModPost } from '@/Main/Post/Post';
import { DBCommentModeration, DBCommentWithReplies } from '@/interface/dbSchema';

interface ModMenuCommentProps {
  commentId: string;
  moderation: DBCommentModeration | null;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  isMod: IsModPost;
  token: string | null;
  showEditDropdown: string | null | undefined;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>> | undefined;
  showModDropdown: string | null;
  setShowModDropdown?: React.Dispatch<React.SetStateAction<string | null>>;
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
}

export default function ModMenuComment({
  commentId,
  moderation,
  setComments,
  isMod,
  token,
  showEditDropdown,
  setShowEditDropdown,
  showModDropdown,
  setShowModDropdown,
  onModerationCb,
}: ModMenuCommentProps) {
  const [showRemovalReasonModal, setShowRemovalReasonModal] = useState(false);

  useClickOutside(() => {
    setShowModDropdown?.(null);
  });

  const { onApproveComplete, onRemoveComplete, onUpdateRemovalReason } =
    useCommentModeration(setComments);

  if (!isMod) return null;

  return (
    <div className="df">
      <ModerationTag
        show={showRemovalReasonModal}
        setShow={setShowRemovalReasonModal}
        moderation={moderation}
        token={token}
        apiData={{ id: commentId }}
        type="comment"
        onUpdateRemovalReason={onUpdateRemovalReason}
        className="mr-1"
      />

      <ModMenuButton
        onClick={() => {
          if (showEditDropdown) {
            setShowEditDropdown?.(null);
            setShowModDropdown?.(commentId);
          } else {
            setShowModDropdown?.((prev) => (prev === commentId ? null : commentId));
          }
        }}
      />

      <div className="relative">
        <DropdownMenu
          className={`!right-1 !top-[20px] min-w-[200px] rounded-md transition-opacity duration-300
            ${showModDropdown === commentId ? '!z-10 opacity-100' : '!-z-10 opacity-0'}`}
        >
          {/* Show Approve button if post is not approved */}
          {!moderation || moderation.action === 'REMOVED' ? (
            <>
              <DropdownButton
                text="Approve comment"
                icon={<CheckIcon />}
                alt="Approve comment"
                setterFunc={setShowModDropdown}
                show={showModDropdown === commentId}
                customFunc={() => {
                  void moderateComment(
                    token,
                    {
                      comment_id: commentId,
                      moderation_action: 'APPROVED',
                    },
                    {
                      loading: 'Approving comment...',
                      success: 'Successfully approved comment',
                      error: 'Failed to approve comment',
                    },
                  ).then((success) => {
                    setShowModDropdown?.(null);
                    onApproveComplete(commentId, success, isMod);
                    onModerationCb?.('APPROVED');
                  });
                }}
              />

              {moderation?.reason && (
                <DropdownButton
                  text="Update removal reason"
                  icon={<PlusIcon />}
                  alt="Update removal reason"
                  setterFunc={setShowModDropdown}
                  show={showModDropdown === commentId}
                  customFunc={() => {
                    setShowRemovalReasonModal(true);
                  }}
                />
              )}
            </>
          ) : (
            <></>
          )}

          {/* Show Remove button if post is not removed */}
          {!moderation || moderation.action === 'APPROVED' ? (
            <DropdownButton
              text="Remove comment"
              src="/x-close.svg"
              alt="Remove comment"
              show={showModDropdown === commentId}
              customFunc={() => {
                void moderateComment(
                  token,
                  {
                    comment_id: commentId,
                    moderation_action: 'REMOVED',
                  },
                  {
                    loading: 'Removing comment...',
                    success: 'Successfully removed comment',
                    error: 'Failed to remove comment',
                  },
                ).then((success) => {
                  setShowModDropdown?.(null);
                  onRemoveComplete(commentId, success, isMod);
                  onModerationCb?.('REMOVED');
                });
              }}
            />
          ) : (
            <></>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
}
