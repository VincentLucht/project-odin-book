import { MessageCircle } from 'lucide-react';

interface ReplyProps {
  totalCommentCount?: number;
  mode?: 'overview' | 'comment';
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Reply({
  totalCommentCount,
  mode = 'overview',
  onClick,
}: ReplyProps) {
  return (
    <button
      className={`px-4 transition-all hover:bg-hover-gray active:bg-active-gray
        ${mode === 'overview' ? 'interaction-button-wrapper' : 'text-gray-400 interaction-button-wrapper-secondary hover:text-white'}`}
      onClick={onClick}
    >
      <MessageCircle className="h-5 w-5" />

      {totalCommentCount && <span className="text-sm">{totalCommentCount}</span>}
      {mode === 'comment' && <span className="text-xs">Reply</span>}
    </button>
  );
}
