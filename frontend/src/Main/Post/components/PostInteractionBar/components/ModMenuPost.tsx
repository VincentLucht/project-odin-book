import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ModMenuButton from '@/components/Interaction/ModMenuButton';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import PostFlairSelection from '@/Main/Post/components/PostFlairTag/PostFlairSelection/PostFlairSelection';
import ModerationTag from '@/Main/Post/components/tags/common/ModerationTag';
import {
  CheckIcon,
  LockIcon,
  TriangleAlertIcon,
  CircleAlertIcon,
  PlusIcon,
  PencilIcon,
} from 'lucide-react';

import {
  moderatePost,
  updatePostAsModerator,
} from '@/Main/Post/components/PostInteractionBar/api/postModerationAPI';

import { DBPostModeration, PostAssignedFlair } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

interface ModMenuPostProps {
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
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  token: string | null;
  isMod: IsMod | undefined;
  showEditDropdown: string | null | undefined;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>> | undefined;
  showModDropdown: string | null | undefined;
  setShowModDropdown: React.Dispatch<React.SetStateAction<string | null>> | undefined;

  onApproveComplete?: (postId: string, success: boolean, isMod: IsMod) => void;
  onRemoveComplete?: (postId: string, success: boolean, isMod: IsMod) => void;
  onLockCommentsComplete?: (postId: string, locked: boolean, success: boolean) => void;
  onUpdateNSFWComplete?: (postId: string, isNSFW: boolean, success: boolean) => void;
  onUpdateSpoilerComplete?: (
    postId: string,
    isSpoiler: boolean,
    success: boolean,
  ) => void;
  onUpdateRemovalReason?: (postId: string, newReason: string, success: boolean) => void;
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
}

export default function ModMenuPost({
  post,
  setPost,
  token,
  showEditDropdown,
  setShowEditDropdown,
  showModDropdown,
  setShowModDropdown,
  isMod,
  // cb functions
  onApproveComplete,
  onRemoveComplete,
  onLockCommentsComplete,
  onUpdateNSFWComplete,
  onUpdateSpoilerComplete,
  onUpdateRemovalReason,
  onModerationCb,
}: ModMenuPostProps) {
  const [showRemovalReasonModal, setShowRemovalReasonModal] = useState(false);
  const [showPostFlairSelection, setShowPostFlairSelection] = useState(false);
  const navigate = useNavigate();

  if (!isMod) return null;

  const { id: postId, is_mature, is_spoiler, lock_comments, moderation } = post;

  const handleEditFlair = () => {
    const targetRoute = `/r/${post?.community?.name}/${post.id}`;
    const targetRouteEdit = `/r/${post?.community?.name}/${post.id}?edit-post-flair=true`;

    // Remove slugging
    const currentPathParts = window.location.pathname.split('/');
    const currentRouteBase = currentPathParts.slice(0, 4).join('/');
    const currentRouteWithQuery = currentRouteBase + window.location.search;

    if (currentRouteBase === targetRoute) {
      setShowPostFlairSelection(true);
      return;
    }

    if (currentRouteWithQuery !== targetRouteEdit) {
      navigate(targetRouteEdit);
    } else {
      setShowPostFlairSelection(true);
    }
  };

  return (
    <div className="df">
      <ModerationTag
        show={showRemovalReasonModal}
        setShow={setShowRemovalReasonModal}
        moderation={moderation}
        token={token}
        apiData={{ id: post.id }}
        onUpdateRemovalReason={onUpdateRemovalReason}
        className="mr-1"
      />

      <ModMenuButton
        onClick={() => {
          if (showEditDropdown) {
            setShowEditDropdown?.(null);
            setShowModDropdown?.(postId);
          } else {
            setShowModDropdown?.((prev) => (prev === postId ? null : postId));
          }
        }}
      />

      <div className="relative">
        <DropdownMenu
          className={`!right-1 !top-[20px] min-w-[200px] rounded-md transition-opacity duration-300
            ${showModDropdown === postId ? '!z-10 opacity-100' : '!-z-10 opacity-0'}`}
        >
          {/* Show Approve button if post is not already approved */}
          {!moderation || moderation.action === 'REMOVED' ? (
            <>
              <DropdownButton
                text="Approve post"
                icon={<CheckIcon />}
                alt="Approve post"
                setterFunc={setShowModDropdown}
                show={showModDropdown === postId}
                customFunc={() => {
                  void moderatePost(
                    token,
                    {
                      post_id: postId,
                      moderation_action: 'APPROVED',
                    },
                    {
                      loading: 'Approving post...',
                      success: 'Successfully approved post',
                      error: 'Failed to approve post',
                    },
                  ).then((success) => {
                    setShowModDropdown?.(null);
                    onApproveComplete?.(postId, success, isMod);
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
                  show={showModDropdown === postId}
                  customFunc={() => {
                    setShowRemovalReasonModal(true);
                  }}
                />
              )}
            </>
          ) : (
            <></>
          )}

          {/* Show Remove button if post is not already removed */}
          {!moderation || moderation.action === 'APPROVED' ? (
            <DropdownButton
              text="Remove post"
              src="/x-close.svg"
              alt="Remove post"
              show={showModDropdown === postId}
              customFunc={() => {
                void moderatePost(
                  token,
                  {
                    post_id: postId,
                    moderation_action: 'REMOVED',
                  },
                  {
                    loading: 'Removing post...',
                    success: 'Successfully removed post',
                    error: 'Failed to remove post',
                  },
                ).then((success) => {
                  setShowModDropdown?.(null);
                  onRemoveComplete?.(postId, success, isMod);
                  onModerationCb?.('REMOVED');
                });
              }}
            />
          ) : (
            <></>
          )}

          <DropdownButton
            text="Edit post flair"
            icon={<PencilIcon />}
            alt="Edit post flair"
            setterFunc={setShowModDropdown}
            show={showModDropdown === postId}
            customFunc={handleEditFlair}
          />

          <DropdownButton
            text={lock_comments ? 'Unlock comments' : 'Lock comments'}
            icon={<LockIcon />}
            alt={lock_comments ? 'Unlock comments' : 'Lock comments'}
            setterFunc={setShowModDropdown}
            show={showModDropdown === postId}
            customFunc={() => {
              void updatePostAsModerator(
                token,
                {
                  post_id: postId,
                  lock_comments: !lock_comments,
                },
                {
                  loading: lock_comments
                    ? 'Unlocking comments...'
                    : 'Locking comments...',
                  success: lock_comments
                    ? 'Successfully unlocked comments'
                    : 'Successfully locked comments',
                  error: lock_comments
                    ? 'Failed to unlock comments'
                    : 'Failed to lock comments',
                },
              ).then((success) => {
                if (!success) return;
                onLockCommentsComplete?.(postId, !lock_comments, success);
              });
            }}
          />

          <DropdownButton
            text={is_mature ? 'Remove NSFW tag' : 'Add NSFW tag'}
            icon={<TriangleAlertIcon />}
            alt={is_mature ? 'Remove NSFW tag' : 'Add NSFW tag'}
            setterFunc={setShowModDropdown}
            show={showModDropdown === postId}
            customFunc={() => {
              void updatePostAsModerator(
                token,
                {
                  post_id: postId,
                  is_mature: !is_mature,
                },
                {
                  loading: 'Updating NSFW status...',
                  success: 'Successfully marked post as NSFW',
                  error: 'Failed to mark post as NSFW',
                },
              ).then((success) => {
                if (!success) return;
                onUpdateNSFWComplete?.(postId, !is_mature, success);
              });
            }}
          />

          <DropdownButton
            text={is_spoiler ? 'Remove spoiler tag' : 'Add spoiler tag'}
            icon={<CircleAlertIcon />}
            alt={is_spoiler ? 'Remove spoiler tag' : 'Add spoiler tag'}
            setterFunc={setShowModDropdown}
            show={showModDropdown === postId}
            customFunc={() => {
              void updatePostAsModerator(
                token,
                {
                  post_id: postId,
                  is_spoiler: !is_spoiler,
                },
                {
                  loading: is_spoiler
                    ? 'Removing spoiler tag...'
                    : 'Adding spoiler tag...',
                  success: is_spoiler
                    ? 'Successfully removed spoiler tag'
                    : 'Successfully added spoiler tag',
                  error: is_spoiler
                    ? 'Failed to remove spoiler tag'
                    : 'Failed to add spoiler tag',
                },
              ).then((success) => {
                if (!success) return;
                onUpdateSpoilerComplete?.(postId, !is_spoiler, success);
              });
            }}
          />
        </DropdownMenu>
      </div>

      <PostFlairSelection
        show={showPostFlairSelection}
        setShow={setShowPostFlairSelection}
        communityName={post?.community?.name}
        postId={post.id}
        setPost={setPost}
        token={token}
        activePostFlairId={post.post_assigned_flair?.[0]?.community_flair.id}
      />
    </div>
  );
}
