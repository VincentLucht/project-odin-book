import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';

import PostSidebar from '@/Main/Post/components/PostSidebar/PostSidebar';
import CommunityPFPSmall from '@/components/CommunityPFPSmall';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import CommentSection from '@/Main/Post/components/CommentSection/CommentSection';
import PostEditDropdownMenu from '@/Main/Post/components/PostEditor/PostEditDropdownMenu';
import PostContent from '@/Main/Post/components/PostContent/PostContent';
import SpoilerTag from '@/Main/Post/components/tags/common/SpoilerTag';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';

import handleFetchPost from '@/Main/Post/api/fetch/handleFetchPost';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';
import getRelativeTime from '@/util/getRelativeTime';

import { DBPostWithCommunity } from '@/interface/dbSchema';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { VoteType } from '@/interface/backendTypes';

// TODO: Add loading + not found
// TODO: Add go back button => but like completely back
export default function Post() {
  const [post, setPost] = useState<DBPostWithCommunity | null>(null);
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const [isEditActive, setIsEditActive] = useState(false);

  const { communityName, postId, postName } = useParams();
  const { user, token } = useAuth();
  const isUserPoster = user?.id === post?.poster_id;
  console.log(post);

  useEffect(() => {
    handleFetchPost(postId ?? '', token, setPost);
  }, [postId, token]);

  if (!post) {
    return <div>Not found</div>;
  }

  const onVote = (voteType: VoteType) => {
    void handlePostVote(
      post.id,
      user?.id ?? '',
      token ?? '',
      voteType,
      setPost as React.Dispatch<
        React.SetStateAction<UserAndHistory | DBPostWithCommunity | null>
      >,
      post?.post_votes?.[0]?.vote_type,
    );
  };

  return (
    <div className="p-4 center-main">
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
              community_flair_id={post.post_assigned_flair?.[0]?.community_flair_id}
            />
          </div>

          {/* TITLE */}
          <div className="mt-1 text-2xl font-medium">{post.title}</div>

          <div className="flex items-center gap-1">
            {post.is_spoiler && <SpoilerTag />}
            {post.is_mature && <MatureTag />}
          </div>

          {/* TODO: POST FLAIR */}

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
        </div>

        <PostSidebar community={post.community} />
      </div>
    </div>
  );
}
