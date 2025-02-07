import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';

import PostSidebar from '@/Main/Post/components/PostSidebar/PostSidebar';
import CommunityPFPSmall from '@/components/CommunityPFPSmall';
import Save from '@/components/Interaction/Save';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';
import CommentSection from '@/Main/Post/components/CommentSection/CommentSection';

import handleFetchPost from '@/Main/Post/api/fetch/handleFetchPost';
import handlePostVote from '@/Main/Post/api/vote/handlePostVote';
import getRelativeTime from '@/util/getRelativeTime';

import { DBPostWithCommunity } from '@/interface/dbSchema';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { VoteType } from '@/interface/backendTypes';

// TODO: Add loading + not found
// TODO: Add go back button
export default function Post() {
  const [post, setPost] = useState<DBPostWithCommunity | null>(null);
  const { communityName, postId, postName } = useParams();

  const { user, token } = useAuth();

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

                <div className="df text-gray-secondary">
                  • {getRelativeTime(post.created_at)}
                </div>
              </div>

              {/* TODO: Add lighter secondary gray */}
              <div className="font-extralight">{post.poster.username}</div>
            </div>

            {/* TODO: Add saved */}
            <Save isSaved={false} />
          </div>

          {/* TITLE */}
          <div className="mt-1 text-2xl font-medium">{post.title}</div>

          {/* TODO: POST FLAIR */}

          {/* CONTENT */}
          <div className="py-4 pt-2">{post.body}</div>

          <PostInteractionBar
            totalVoteCount={post.total_vote_score}
            totalCommentCount={post.total_comment_score}
            userVote={{
              hasVoted: post.post_votes?.[0]?.user_id === user?.id,
              voteType: post.post_votes?.[0]?.vote_type,
            }}
            onVote={onVote}
          />

          <CommentSection postId={post.id} userId={user?.id} token={token} />
        </div>

        <PostSidebar />
      </div>
    </div>
  );
}
