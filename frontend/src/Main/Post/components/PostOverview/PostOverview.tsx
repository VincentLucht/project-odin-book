import { useState } from 'react';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import Separator from '@/components/Separator';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import PFP from '@/components/PFP';
import HideContent from '@/Main/Post/components/tags/common/HideContent';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import PostEditDropdownMenuPost from '@/Main/Post/components/PostOverview/components/PostEditDropdownMenuPost';
import PostFlairTag from '@/Main/Post/components/PostFlairTag/PostFlairTag';
import LockedCommentsTag from '@/Main/Post/components/tags/common/LockedCommentsTag';
import { Transition } from '@headlessui/react';
import transitionPropsHeight from '@/util/transitionProps';
import RemovalMessage from '@/components/Message/RemovalMessage';
import DeletedByPoster from '@/components/DeletedByPoster';

import getRelativeTime from '@/util/getRelativeTime';
import IsCommunityMember from '@/Main/Post/components/IsCommunityMember/IsCommunityMember';
import slugify from 'slugify';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';
import notLoggedInError from '@/util/notLoggedInError';

import {
  CommunityMembership,
  CommunityTypes,
  DBPostWithCommunityName,
} from '@/interface/dbSchema';
import { FetchedPost } from '@/Main/Community/Community';
import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { VoteType } from '@/interface/backendTypes';
import { Link, NavigateFunction } from 'react-router-dom';
import { HandlePostVoteType } from '@/Main/Post/api/vote/handlePostVote';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';
import { LockIcon } from 'lucide-react';

export interface CommunityInfo {
  id: string;
  name: string;
  profile_picture_url: string | null;
  user_communities: CommunityMembership[] | undefined;
  type?: CommunityTypes;
}

export type HomepagePost = Omit<DBPostWithCommunityName, 'moderation'>;

interface PostOverviewProps {
  post: DBPostWithCommunityName | FetchedPost;
  community: CommunityInfo;
  userId: string | undefined;
  token: string | null;
  navigate: NavigateFunction;
  showEditDropdown: string | null;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setUserHistory?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  showPoster?: boolean;
  showMembership?: boolean;
  showFlair?: boolean;
  showModOptions?: boolean;
  showPrivate?: boolean; // display a lock icon next to a post from a private community
  showRemovedByModeration?: boolean;
  isMod?: IsMod;
  showModDropdown?: string | null;
  isLast?: boolean;
  showCommunityAndUser?: boolean;
  isLastModeration?: boolean;
  setShowModDropdown?: React.Dispatch<React.SetStateAction<string | null>>;
  onToggle?: (id: string) => void;

  deleteFunc: () => void;
  spoilerFunc: () => void;
  matureFunc: () => void;
  removePostFlairFunc: () => void;
  manageSaveFunc: (action: boolean) => void;
}

export default function PostOverview({
  post,
  community,
  userId,
  token,
  navigate,
  showEditDropdown,
  setShowEditDropdown,
  setUserHistory,
  setPosts,
  showPoster = false,
  showMembership = true,
  showModOptions = false,
  showPrivate = false,
  showRemovedByModeration = false,
  isMod = false,
  isLast,
  showCommunityAndUser = false,
  isLastModeration,
  showModDropdown,
  setShowModDropdown,
  showFlair = true,
  // Edit functions
  deleteFunc,
  spoilerFunc,
  matureFunc,
  removePostFlairFunc,
  manageSaveFunc,
}: PostOverviewProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showMature, setShowMature] = useState(false);

  const isMature = post.is_mature;
  const isSpoiler = post.is_spoiler;

  const showBody = showMature || showSpoiler || !(isMature || isSpoiler);
  const hideContent = !showMature && !showSpoiler && (isMature || isSpoiler);
  const mode = showCommunityAndUser ? 'community' : showPoster ? 'user' : 'community';

  const isUserPoster = userId === post.poster_id ? true : false;
  const userMember =
    showMembership && 'community' in post
      ? (post.community.user_communities ?? [])
      : null;
  const hasReported = post?.reports?.[0]?.reporter_id === userId;
  const isSaved = post?.saved_by?.[0]?.user_id === userId && userId !== undefined;

  const { currentWidth, isMobile } = useGetScreenSize();
  const isBelow500px = currentWidth <= 500;

  const onVote = (voteType: VoteType) => {
    if (!token || !userId) {
      notLoggedInError('You need to log in to vote');
      return;
    }

    void handlePostVote(
      post.id,
      userId,
      token,
      voteType,
      setPosts
        ? (setPosts as HandlePostVoteType)
        : (setUserHistory as HandlePostVoteType),
      post?.post_votes?.[0]?.vote_type,
    );
  };

  const postRedirect = (e: React.MouseEvent) => {
    // Only redirect by clicking the div directly and NOT a button
    if (!(e.target as HTMLElement).closest('button')) {
      navigate(
        `/r/${community.name}/${post.id}/${slugify(post.title, { lower: true })}`,
      );
    }
  };

  const userRedirect = () => {
    navigate(`/user/${post.poster?.username}`);
  };

  const commentToPostRedirect = () => {
    navigate(`/r/${community.name}/${post.id}/${slugify(post.title, { lower: true })}`);
  };

  return (
    <div>
      <Separator />

      <div
        className="my-[6px] break-all rounded-2xl px-2 py-2 transition-all hover:cursor-pointer
          hover:bg-hover-gray-secondary"
        onClick={postRedirect}
      >
        <div className="flex justify-between">
          <div className="group gap-1 text-sm df">
            <Link
              to={
                mode === 'community'
                  ? `/r/${community.name}`
                  : `/user/${post.poster?.username}`
              }
              onClick={(e) => e.stopPropagation()}
            >
              <PFP
                src={
                  showCommunityAndUser
                    ? community.profile_picture_url
                    : showPoster
                      ? post.poster?.profile_picture_url
                      : community.profile_picture_url
                }
                mode={mode}
              />
            </Link>

            {showCommunityAndUser ? (
              <div className="flex items-center gap-1">
                <div className="font-semibold">r/{community.name}</div>

                <span>•</span>

                <button
                  className="font-medium group-hover:underline"
                  onClick={() => !post.poster?.deleted_at && userRedirect()}
                >
                  {(post.poster?.deleted_at ?? post.deleted_at)
                    ? '[deleted]'
                    : `u/${post.poster?.username}`}
                </button>
              </div>
            ) : showPoster ? (
              <button
                className="font-medium group-hover:underline"
                onClick={() => !post.poster?.deleted_at && userRedirect()}
              >
                {(post.poster?.deleted_at ?? post.deleted_at)
                  ? '[deleted]'
                  : `u/${post.poster?.username}`}
              </button>
            ) : (
              <Link
                to={`/r/${community.name}`}
                className="font-semibold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                r/{community.name}
              </Link>
            )}

            {showPrivate && community?.type === 'PRIVATE' && (
              <LockIcon className="h-4 w-4" />
            )}

            <div className="gap-1 whitespace-nowrap text-xs df text-gray-secondary">
              • {getRelativeTime(post.created_at, true, isMobile)}
              {post.edited_at && !post.deleted_at && !isBelow500px && (
                <div className="text-xs df">
                  • edited {getRelativeTime(post.edited_at, true)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showMembership && userMember && setUserHistory && !isBelow500px && (
              <IsCommunityMember
                userMember={userMember}
                userId={userId}
                token={token}
                communityId={post.community_id}
                setFetchedUser={setUserHistory}
                navigate={navigate}
              />
            )}

            {post.lock_comments && <LockedCommentsTag className="-mr-[5px]" />}

            <PostEditDropdownMenuPost
              token={token}
              isUserPoster={isUserPoster}
              communityName={community.name}
              postId={post.id}
              postName={post.title}
              hasPostFlair={Boolean(post.post_assigned_flair?.length)}
              isMature={isMature}
              isSpoiler={isSpoiler}
              hasReported={hasReported}
              showEditDropdown={showEditDropdown}
              isLast={isLast}
              setShowEditDropdown={setShowEditDropdown}
              navigate={navigate}
              setFetchedUser={setUserHistory}
              setPosts={setPosts}
              // edit functions
              deleteFunc={deleteFunc}
              spoilerFunc={spoilerFunc}
              matureFunc={matureFunc}
              removePostFlairFunc={removePostFlairFunc}
              manageSaveFunc={manageSaveFunc}
              isSaved={isSaved}
            />
          </div>
        </div>

        <div className="pb-[6px]">
          <div className="flex items-center gap-1">
            {isSpoiler && <SpoilerTag />}
            {isMature && <MatureTag />}
          </div>

          {showRemovedByModeration ? (
            <RemovalMessage show={true} type="post" />
          ) : (
            <div className="py-[6px] text-xl font-semibold">{post.title}</div>
          )}

          <PostFlairTag
            showFlair={showFlair}
            postAssignedFlair={post.post_assigned_flair}
            className="mb-2"
          />

          {!showRemovedByModeration &&
            (post.deleted_at ? (
              <DeletedByPoster type="post" />
            ) : (
              <>
                <Transition show={showBody} {...transitionPropsHeight}>
                  <div className="line-clamp-[10] whitespace-pre-line break-all">
                    {post.body}
                  </div>
                </Transition>

                <Transition show={hideContent} {...transitionPropsHeight}>
                  <div>
                    <HideContent
                      isMature={isMature}
                      isSpoiler={isSpoiler}
                      setShowMature={setShowMature}
                      setShowSpoiler={setShowSpoiler}
                    />
                  </div>
                </Transition>
              </>
            ))}
        </div>

        <PostInteractionBar
          post={{ ...post, community: { ...community } }}
          setPosts={setPosts}
          token={token}
          userVote={{
            hasVoted: post?.post_votes?.[0]?.user_id === userId,
            voteType: post?.post_votes?.[0]?.vote_type,
          }}
          onVote={onVote}
          postRedirect={commentToPostRedirect}
          showModOptions={showModOptions}
          isMod={isMod}
          isLast={isLastModeration}
          isMobile={isMobile}
          showModDropdown={showModDropdown}
          setShowModDropdown={setShowModDropdown}
          showEditDropdown={showEditDropdown}
          setShowEditDropdown={setShowEditDropdown}
        />
      </div>
    </div>
  );
}
