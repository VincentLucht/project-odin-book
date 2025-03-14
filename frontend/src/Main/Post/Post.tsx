import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';

import PostSidebar from '@/Main/Post/components/PostSidebar/PostSidebar';
import CommunityPFPSmall from '@/components/CommunityPFPSmall';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import CommentSection from '@/Main/Post/components/CommentSection/CommentSection';
import PostEditDropdownMenu from '@/Main/Post/components/PostEditor/PostEditDropdownMenu';
import PostFlairSelection from '@/Main/Post/components/PostFlairTag/PostFlairSelection/PostFlairSelection';
import PostContent from '@/Main/Post/components/PostContent/PostContent';
import PostFlairTag from '@/Main/Post/components/PostFlairTag/PostFlairTag';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';

import handleFetchPost from '@/Main/Post/api/fetch/handleFetchPost';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';
import getRelativeTime from '@/util/getRelativeTime';

import { DBPostWithCommunity } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { HandlePostVoteType } from '@/Main/Post/api/vote/handlePostVote';

// TODO: Add loading + not found
// TODO: Add go back button => but like completely back
export default function Post() {
  const [post, setPost] = useState<DBPostWithCommunity | null>(null);
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const [isEditActive, setIsEditActive] = useState(false);
  const [showPostFlairSelection, setShowPostFlairSelection] = useState(false);

  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const isUserPoster = user?.id === post?.poster_id;

  useEffect(() => {
    handleFetchPost(postId ?? '', token, setPost);
  }, [postId, token]);

  useEffect(() => {
    if (!post) return;

    const isUserPoster = user?.id === post?.poster_id;

    if (!isUserPoster) return;

    if (searchParams.get('edit')) {
      setIsEditActive(true);
    }
    if (searchParams.get('edit-post-flair')) {
      setShowPostFlairSelection(true);
    }
  }, [post, user, searchParams]);

  if (!post) {
    return <div>Not found</div>;
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

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div className="center-main-content">
        <div className="flex flex-col">
          <div className="flex gap-1 text-sm">
            <CommunityPFPSmall src={post.community.profile_picture_url} size="large" />

            <div className="flex-1 text-xs">
              <div className="flex gap-1">
                <div className="text-sm font-semibold">r/{post.community.name}</div>

                <div className="mt-[2px] gap-1 df text-gray-secondary">
                  <div className="df">• {getRelativeTime(post.created_at)}</div>
                  {post.edited_at && !post.deleted_at && (
                    <div className="text-xs df">
                      • edited {getRelativeTime(post.edited_at, true)}
                    </div>
                  )}
                </div>
              </div>

              <div className="font-extralight text-gray-300">
                {post?.poster?.username}
              </div>
            </div>

            {/* TODO: Add saved */}
            <PostEditDropdownMenu
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

          {/* TITLE */}
          <div className="flex items-center gap-1">
            {post.is_spoiler && <SpoilerTag />}
            {post.is_mature && <MatureTag />}
          </div>

          <div className="mt-1 text-2xl font-medium">{post.title}</div>

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
            totalVoteCount={post.total_vote_score}
            totalCommentCount={post.total_comment_score}
            userVote={{
              hasVoted: post.post_votes?.[0]?.user_id === user?.id,
              voteType: post.post_votes?.[0]?.vote_type,
            }}
            onVote={onVote}
          />

          <CommentSection
            postId={post.id}
            originalPoster={post.poster ? post.poster.username : null}
            user={user}
            token={token}
            setPost={setPost}
          />

          <PostFlairSelection
            show={showPostFlairSelection}
            setShow={setShowPostFlairSelection}
            communityId={post.community_id}
            activePostFlairId={post.post_assigned_flair?.[0]?.community_flair.id}
            postId={post.id}
            setPost={setPost}
            token={token}
          />
        </div>

        <PostSidebar community={post.community} />
      </div>
    </div>
  );
}
