import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import useIsModerator from '@/hooks/useIsModerator';
import useIsMember from '@/hooks/useIsMember';

import PostSidebar from '@/Main/Post/components/PostSidebar/PostSidebar';
import PFP from '@/components/PFP';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import CommentSection from '@/Main/Post/components/CommentSection/CommentSection';
import PostEditDropdownMenu from '@/Main/Post/components/PostEditor/PostEditDropdownMenu';
import PostFlairSelection from '@/Main/Post/components/PostFlairTag/PostFlairSelection/PostFlairSelection';
import PostContent from '@/Main/Post/components/PostContent/PostContent';
import PostFlairTag from '@/Main/Post/components/PostFlairTag/PostFlairTag';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import PostLazy from '@/Main/Post/components/Loading/PostLazy';
import LockedCommentsTag from '@/Main/Post/components/tags/common/LockedCommentsTag';

import handleFetchPost from '@/Main/Post/api/fetch/handleFetchPost';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';
import getRelativeTime from '@/util/getRelativeTime';

import { DBPostWithCommunity } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { HandlePostVoteType } from '@/Main/Post/api/vote/handlePostVote';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';
import { CommunityModerator } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';

export type IsModPost =
  | false
  | {
      is_active: boolean;
      user: Omit<CommunityModerator, 'user_assigned_flair'>;
    };

interface PostProps {
  mode?: 'fetched' | 'normal';
  options?: { showComments: boolean; commentId: string };
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
  givenPostId?: string | null;
}

// TODO: Add loading + not found
// TODO: Add go back button => but like completely back
export default function Post({
  mode = 'normal',
  options = { showComments: true, commentId: '' },
  onModerationCb,
  givenPostId = null,
}: PostProps) {
  const [post, setPost] = useState<DBPostWithCommunity | null>(null);
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const [showModDropdown, setShowModDropdown] = useState<string | null>(null);
  const [isEditActive, setIsEditActive] = useState(false);
  const [showPostFlairSelection, setShowPostFlairSelection] = useState(false);

  const [postLoading, setPostLoading] = useState(true);
  const navigate = useNavigate();
  const { isSmallScreen, isMobile, isBelow550px } = useGetScreenSize();
  const [showSidebar, setShowSidebar] = useState(false);

  const { postId: urlPostId } = useParams();
  const effectivePostId = mode === 'fetched' && givenPostId ? givenPostId : urlPostId;
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();

  const isUserPoster = user?.id === post?.poster_id;

  useEffect(() => {
    setPostLoading(true);
    const onComplete = () => setPostLoading(false);

    handleFetchPost(effectivePostId ?? '', token, setPost, onComplete);
  }, [effectivePostId, token, mode]);

  const isMod = useIsModerator(user, post?.community?.community_moderators);
  const isMember = useIsMember(user, post?.community);
  const hasReported = (post?.reports?.length ?? 0) > 0;

  useEffect(() => {
    if (!post && mode !== 'normal') return;

    const isUserPoster = user?.id === post?.poster_id;

    if (!isUserPoster) return;

    if (searchParams.get('edit')) {
      setIsEditActive(true);
    }
    if (searchParams.get('edit-post-flair')) {
      setShowPostFlairSelection(true);
    }
  }, [post, user, searchParams, mode]);

  if (!post || postLoading) {
    return <PostLazy mode={mode} />;
  }

  const onVote = (voteType: VoteType) => {
    void handlePostVote(
      post.id,
      user?.id ?? '',
      token ?? '',
      voteType,
      setPost as HandlePostVoteType,
      post?.post_votes?.[0]?.vote_type,
    );
  };

  const communityRedirect = () => {
    navigate(`/r/${post.community.name}`);
  };

  const userRedirect = () => {
    navigate(`/user/${post.poster?.username}`);
  };

  return (
    <div className="p-4 center-main">
      <div
        className={`w-full lg:center-main-content ${mode === 'fetched' && '!block'} `}
      >
        <div className="flex flex-col">
          <div className="flex gap-1 text-sm">
            <PFP src={post.community.profile_picture_url} size="large" />

            <div className="ml-1 flex-1 text-xs">
              <div className="flex gap-1">
                <button
                  className="break-all text-left text-sm font-semibold hover:underline"
                  onClick={communityRedirect}
                >
                  r/{post.community.name}
                </button>

                <div className="mt-[2px] gap-1 df text-gray-secondary">
                  <div className="whitespace-nowrap df">
                    • {getRelativeTime(post.created_at, isMobile, isMobile)}
                  </div>

                  {post.edited_at && !post.deleted_at && (
                    <div className="text-xs df">
                      • edited {getRelativeTime(post.edited_at, true)}
                    </div>
                  )}
                </div>
              </div>

              <button
                className={`font-extralight text-gray-300 ${post.poster?.username && 'hover:underline'}`}
                onClick={() => {
                  if (post.poster?.username) {
                    userRedirect();
                  }
                }}
              >
                {(post.deleted_at ?? post.poster?.deleted_at)
                  ? '[deleted]'
                  : `u/${post?.poster?.username}`}
              </button>
            </div>

            <div className="gap-2 df">
              {post.lock_comments && <LockedCommentsTag className="-mr-[5px]" />}

              {/* TODO: Add saved */}
              <PostEditDropdownMenu
                hasReported={hasReported}
                isUserPoster={isUserPoster}
                postId={post.id}
                token={token}
                showDropdown={showEditDropdown}
                setShowDropdown={setShowEditDropdown}
                setIsEditActive={setIsEditActive}
                setPost={setPost}
                newBody={post.body}
                isMature={post.is_mature}
                isSpoiler={post.is_spoiler}
                setShowPostFlairSelection={setShowPostFlairSelection}
              />
            </div>
          </div>

          {/* TAGS */}
          <div className="flex items-center gap-1">
            {post.is_spoiler && <SpoilerTag />}
            {post.is_mature && <MatureTag />}
          </div>

          {/* TITLE */}
          <div className="mt-1 break-all text-2xl font-medium">{post.title}</div>

          <PostFlairTag
            showFlair={true}
            postAssignedFlair={post.post_assigned_flair}
            className="mt-2"
          />

          {/* CONTENT */}
          <PostContent
            post={post}
            isEditActive={isEditActive}
            setIsEditActive={setIsEditActive}
            setPost={setPost}
            token={token}
          />

          <PostInteractionBar
            post={{ ...post }}
            setPost={setPost}
            token={token}
            userVote={{
              hasVoted: post.post_votes?.[0]?.user_id === user?.id,
              voteType: post.post_votes?.[0]?.vote_type,
            }}
            mode="post"
            onVote={onVote}
            showModOptions={isMod !== false}
            isMod={isMod as IsMod}
            showModDropdown={showModDropdown}
            setShowModDropdown={setShowModDropdown}
            showEditDropdown={showEditDropdown}
            setShowEditDropdown={setShowEditDropdown}
            onModerationCb={onModerationCb}
          />

          {options.showComments && (
            <CommentSection
              isBelow550px={isBelow550px}
              isMobile={isMobile}
              isSmallScreen={isSmallScreen}
              showSidebar={showSidebar}
              setShowSidebar={setShowSidebar}
              post={{ ...post }}
              originalPoster={post.poster ? post.poster.username : null}
              user={user}
              token={token}
              setPost={setPost}
              isMod={isMod}
              givenParentCommentId={options.commentId}
              onModerationCb={onModerationCb}
            />
          )}

          <PostFlairSelection
            show={showPostFlairSelection}
            setShow={setShowPostFlairSelection}
            communityName={post.community.name}
            activePostFlairId={post.post_assigned_flair?.[0]?.community_flair.id}
            postId={post.id}
            setPost={setPost}
            token={token}
          />
        </div>

        {mode === 'normal' && ((!isMobile && !isSmallScreen) || showSidebar) && (
          <PostSidebar
            community={post.community}
            setPost={setPost}
            user={user}
            token={token}
            navigate={navigate}
            showMembership={{ show: true, isMember }}
            isMod={isMod !== false}
            className={`${isSmallScreen || isMobile ? 'mt-8' : ''}`}
          />
        )}
      </div>
    </div>
  );
}
