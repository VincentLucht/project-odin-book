import Save from '@/components/Interaction/Save';
import Separator from '@/components/Separator';
import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';

import getRelativeTime from '@/util/getRelativeTime';
import IsCommunityMember from '@/Main/Post/components/IsCommunityMember/IsCommunityMember';
import handlePostVote from '@/Main/Post/api/handlePostVote';

import { DBPostWithCommunityName } from '@/interface/dbSchema';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { VoteType } from '@/interface/backendTypes';

interface PostOverviewProps {
  post: DBPostWithCommunityName;
  userId: string;
  token: string;
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
}

export default function PostOverview({
  post,
  userId,
  token,
  setFetchedUser,
}: PostOverviewProps) {
  const userMember = post.community.user_communities;

  const onVote = (voteType: VoteType) => {
    void handlePostVote(
      post.id,
      userId,
      token,
      voteType,
      setFetchedUser,
      post?.post_votes?.[0]?.vote_type,
    );
  };

  return (
    <div className="">
      <Separator />

      <div
        className="my-[6px] rounded-2xl px-2 py-2 transition-all hover:cursor-pointer
          hover:bg-hover-gray-secondary"
      >
        <div className="flex justify-between">
          <div className="gap-1 text-sm df">
            <img
              src={
                post.community.profile_picture_url
                  ? post.community.profile_picture_url
                  : '/community-default.svg'
              }
              alt="Community Profile Picture"
              className="h-6 w-6 rounded-full border"
            />

            <div>{post.community.name}</div>

            <div className="ml-1 text-gray-secondary">
              • {getRelativeTime(post.created_at)}
            </div>
          </div>

          <div className="flex gap-2">
            <IsCommunityMember userMember={userMember} userId={userId} />

            {/* TODO: Add saved stuff */}
            <Save isSaved={false} />
          </div>
        </div>

        <div className="pb-[6px]">
          <div className="py-[6px] text-xl font-semibold">{post.title}</div>

          <div>{post.body}</div>

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
        />
      </div>
    </div>
  );
}
