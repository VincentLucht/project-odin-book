import { useState } from 'react';

import Save from '@/components/Interaction/Save';
import Separator from '@/components/Separator';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import CommunityPFPSmall from '@/components/CommunityPFPSmall';
import HideContent from '@/Main/Post/components/tags/common/HideContent';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import { Transition } from '@headlessui/react';
import transitionPropsHeight from '@/util/transitionProps';

import getRelativeTime from '@/util/getRelativeTime';
import IsCommunityMember from '@/Main/Post/components/IsCommunityMember/IsCommunityMember';
import slugify from 'slugify';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';

import { DBPostWithCommunityName } from '@/interface/dbSchema';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { VoteType } from '@/interface/backendTypes';
import { NavigateFunction } from 'react-router-dom';
import { HandlePostVoteType } from '@/Main/Post/api/vote/handlePostVote';

interface PostOverviewProps {
  post: DBPostWithCommunityName;
  userId: string | undefined;
  token: string | null;
  setFetchedUser?: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  navigate: NavigateFunction;
  showPoster?: boolean;
  poster?: { username: string; profile_picture_url: string | null };
  showMembership?: boolean;
}

export default function PostOverview({
  post,
  userId,
  token,
  setFetchedUser,
  setPosts,
  navigate,
  showPoster = false,
  poster,
  showMembership = true,
}: PostOverviewProps) {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showMature, setShowMature] = useState(false);

  const isMature = post.is_mature;
  const isSpoiler = post.is_spoiler;

  const showBody = showMature || showSpoiler || !(isMature || isSpoiler);
  const hideContent = !showMature && !showSpoiler && (isMature || isSpoiler);

  const userMember = post.community.user_communities ?? [];
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
        `/r/${post.community.name}/${post.id}/${slugify(post.title, { lower: true })}`,
      );
    }
  };

  const commentToPostRedirect = () => {
    navigate(
      `/r/${post.community.name}/${post.id}/${slugify(post.title, { lower: true })}`,
    );
  };

  return (
    <div>
      <Separator />

      <div
        className="my-[6px] rounded-2xl px-2 py-2 transition-all hover:cursor-pointer
          hover:bg-hover-gray-secondary"
        onClick={postRedirect}
      >
        <div className="flex justify-between">
          <div className="gap-1 text-sm df">
            <CommunityPFPSmall
              src={
                poster
                  ? post.poster.profile_picture_url
                  : post.community.profile_picture_url
              }
            />

            {showPoster ? (
              <div className="font-medium">u/{post.poster.username}</div>
            ) : (
              <div className="font-semibold">r/{post.community.name}</div>
            )}

            <div className="text-xs text-gray-secondary">
              • {getRelativeTime(post.created_at)}
            </div>
          </div>

          <div className="flex gap-2">
            {showMembership && setFetchedUser && (
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
            <Save isSaved={false} />
          </div>
        </div>

        <div className="pb-[6px]">
          <div className="flex items-center gap-1">
            {isSpoiler && <SpoilerTag />}
            {isMature && <MatureTag />}
          </div>

          <div className="py-[6px] text-xl font-semibold">{post.title}</div>

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
