import { useState } from 'react';

import Separator from '@/components/Separator';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import PFP from '@/components/PFP';
import HideContent from '@/Main/Post/components/tags/common/HideContent';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import PostEditDropdownMenuPost from '@/Main/Post/components/PostOverview/components/PostEditDropdownMenuPost';
import PostFlairTag from '@/Main/Post/components/PostFlairTag/PostFlairTag';
import { Transition } from '@headlessui/react';
import transitionPropsHeight from '@/util/transitionProps';

import getRelativeTime from '@/util/getRelativeTime';
import IsCommunityMember from '@/Main/Post/components/IsCommunityMember/IsCommunityMember';
import slugify from 'slugify';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';

import { CommunityMembership, DBPostWithCommunityName } from '@/interface/dbSchema';
import { FetchedPost } from '@/Main/Community/Community';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { VoteType } from '@/interface/backendTypes';
import { NavigateFunction } from 'react-router-dom';
import { HandlePostVoteType } from '@/Main/Post/api/vote/handlePostVote';

export interface CommunityInfo {
  id: string;
  name: string;
  profile_picture_url: string | null;
  user_communities: CommunityMembership[] | undefined;
}

interface PostOverviewProps {
  post: DBPostWithCommunityName | FetchedPost;
  community: CommunityInfo;
  userId: string | undefined;
  token: string | null;
  setFetchedUser?: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  navigate: NavigateFunction;
  showPoster?: boolean;
  showMembership?: boolean;
  showEditDropdown: string | null;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  showFlair?: boolean;

  deleteFunc: () => void;
  spoilerFunc: () => void;
  matureFunc: () => void;
  removePostFlairFunc: () => void;
}

export default function PostOverview({
  post,
  community,
  userId,
  token,
  setFetchedUser,
  setPosts,
  navigate,
  showPoster = false,
  showMembership = true,
  showEditDropdown,
  setShowEditDropdown,
  showFlair = true,
  // Edit functions
  deleteFunc,
  spoilerFunc,
  matureFunc,
  removePostFlairFunc,
}: PostOverviewProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showMature, setShowMature] = useState(false);

  const isMature = post.is_mature;
  const isSpoiler = post.is_spoiler;

  const showBody = showMature || showSpoiler || !(isMature || isSpoiler);
  const hideContent = !showMature && !showSpoiler && (isMature || isSpoiler);

  const isUserPoster = userId === post.poster_id ? true : false;
  const userMember =
    showMembership && 'community' in post
      ? (post.community.user_communities ?? [])
      : null;

  const onVote = (voteType: VoteType) => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }
    void handlePostVote(
      post.id,
      userId,
      token,
      voteType,
      setPosts
        ? (setPosts as HandlePostVoteType)
        : (setFetchedUser as HandlePostVoteType),
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
          <div className="gap-1 text-sm df">
            <PFP
              src={
                post.poster
                  ? post.poster?.profile_picture_url
                  : community.profile_picture_url
              }
            />

            {showPoster ? (
              <button className="font-medium hover:underline" onClick={userRedirect}>
                {post.poster?.deleted_at ? '[deleted]' : `u/${post.poster?.username}`}
              </button>
            ) : (
              <div className="font-semibold">r/{community.name}</div>
            )}

            <div className="gap-1 text-xs df text-gray-secondary">
              • {getRelativeTime(post.created_at)}
              {post.edited_at && !post.deleted_at && (
                <div className="text-xs df">
                  • edited {getRelativeTime(post.edited_at, true)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showMembership && userMember && setFetchedUser && (
              <IsCommunityMember
                userMember={userMember}
                userId={userId}
                token={token}
                communityId={post.community_id}
                setFetchedUser={setFetchedUser}
                navigate={navigate}
              />
            )}

            {/* TODO: Add saved stuff */}
            <PostEditDropdownMenuPost
              isUserPoster={isUserPoster}
              communityName={community.name}
              postId={post.id}
              postName={post.title}
              hasPostFlair={Boolean(post.post_assigned_flair?.length)}
              isMature={isMature}
              isSpoiler={isSpoiler}
              showEditDropdown={showEditDropdown}
              setShowEditDropdown={setShowEditDropdown}
              navigate={navigate}
              // edit functions
              deleteFunc={deleteFunc}
              spoilerFunc={spoilerFunc}
              matureFunc={matureFunc}
              removePostFlairFunc={removePostFlairFunc}
            />
          </div>
        </div>

        <div className="pb-[6px]">
          <div className="flex items-center gap-1">
            {isSpoiler && <SpoilerTag />}
            {isMature && <MatureTag />}
          </div>

          <div className="py-[6px] text-xl font-semibold">{post.title}</div>

          <PostFlairTag
            showFlair={showFlair}
            postAssignedFlair={post.post_assigned_flair}
            className="mb-2"
          />

          <Transition show={showBody} {...transitionPropsHeight}>
            <div>{post.body}</div>
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

          {/* TODO: Post Flair */}
        </div>

        <PostInteractionBar
          totalVoteCount={post.total_vote_score}
          totalCommentCount={post.total_comment_score}
          userVote={{
            hasVoted: post?.post_votes?.[0]?.user_id === userId,
            voteType: post?.post_votes?.[0]?.vote_type,
          }}
          onVote={onVote}
          postRedirect={commentToPostRedirect}
        />
      </div>
    </div>
  );
}
