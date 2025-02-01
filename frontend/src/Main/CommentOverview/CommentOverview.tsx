import Separator from '@/components/Separator';
import { DBCommentWithCommunityName } from '@/interface/dbSchema';

interface CommentOverview {
  comment: DBCommentWithCommunityName;
}

export default function CommentOverview({ comment }: CommentOverview) {
  return (
    <div>
      <Separator />

      <div className="flex gap-1">
        <img
          src={
            comment.post.community.profile_picture_url
              ? comment.post.community.profile_picture_url
              : '/community-default.svg'
          }
          alt="Community Profile Picture"
          className="h-6 w-6 rounded-full border"
        />

        <div>
          <div className="flex">
            <span>{comment.post.community.name}</span>

            <span>{comment.post.title}</span>
          </div>

          <div>{comment.content}</div>

          <div></div>
        </div>
      </div>
    </div>
  );
}
