import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CirclePlusIcon } from 'lucide-react';

interface MoreRepliesProps {
  hasReplyAtAll: boolean;
  parent_comment_id: string;
}

export default function MoreRepliesButton({
  hasReplyAtAll,
  parent_comment_id,
}: MoreRepliesProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!hasReplyAtAll) {
    return;
  }

  const handleNavigate = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);

    // Only the first 4 parts and append the new parent_comment_id
    // ? r/community_name/post_id/post-title(slugged)
    const basePath = pathParts.slice(0, 4).join('/');
    const newPath = `/${basePath}/${parent_comment_id}`;

    navigate(newPath);
  };

  return (
    <div
      className="group relative ml-[40px] flex w-fit cursor-pointer items-center gap-[2px]"
      onClick={handleNavigate}
    >
      <div className="comment-connector-line-more-replies"></div>
      <CirclePlusIcon className="h-[18px] transition-all group-hover:scale-110 group-active:scale-95" />
      <div className="text-sm text-gray-500 group-hover:underline">More replies</div>
    </div>
  );
}
