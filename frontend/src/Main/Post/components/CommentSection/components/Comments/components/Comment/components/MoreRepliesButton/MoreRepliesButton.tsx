import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CirclePlusIcon } from 'lucide-react';

interface MoreRepliesProps {
  hasReplyAtAll: boolean;
  parent_comment_id: string;
}

// TODO: Fix the "More replies" button stretching out
export default function MoreRepliesButton({
  hasReplyAtAll,
  parent_comment_id,
}: MoreRepliesProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!hasReplyAtAll) {
    return;
  }

  return (
    <div
      className="group relative ml-[40px] flex cursor-pointer items-center gap-[2px]"
      onClick={() => navigate(`${location.pathname}/${parent_comment_id}`)}
    >
      <div className="comment-connector-line-more-replies"></div>

      <CirclePlusIcon className="h-[18px] transition-all group-hover:scale-110 group-active:scale-95" />

      <div className="text-sm text-gray-500 group-hover:underline">More replies</div>
    </div>
  );
}
