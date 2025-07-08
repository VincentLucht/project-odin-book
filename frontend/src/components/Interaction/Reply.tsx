import { MessageCircle } from 'lucide-react';

import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

interface ReplyProps {
  totalCommentCount?: number;
  mode?: 'overview' | 'comment';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  smallMode?: boolean;
}

export default function Reply({
  totalCommentCount,
  mode = 'overview',
  onClick,
  smallMode = false,
}: ReplyProps) {
  return (
    <button
      className={`transition-all hover:bg-hover-gray active:bg-active-gray ${smallMode ? 'px-2' : 'px-4'}
        ${mode === 'overview' ? 'interaction-button-wrapper' : 'text-gray-400 interaction-button-wrapper-secondary hover:text-white'}`}
      onClick={onClick && onClick}
    >
      <MessageCircle className="h-5 w-5" />

      {totalCommentCount && (
        <span className="text-sm">{formatCount(totalCommentCount)}</span>
      )}

      {!smallMode && mode === 'comment' && <span className="text-xs">Reply</span>}
    </button>
  );
}
