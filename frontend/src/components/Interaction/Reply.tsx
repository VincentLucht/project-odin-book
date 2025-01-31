import { MessageCircle } from 'lucide-react';

interface ReplyProps {
  totalCommentCount: number;
}

export default function Reply({ totalCommentCount }: ReplyProps) {
  return (
    <button className="px-4 transition-all interaction-button-wrapper hover:bg-hover-gray active:bg-active-gray">
      <MessageCircle className="h-5 w-5" />

      <span className="text-sm">{totalCommentCount}</span>
    </button>
  );
}
