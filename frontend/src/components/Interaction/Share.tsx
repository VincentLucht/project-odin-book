import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import getBaseURL from '@/Main/Post/components/CommentSection/util/getBaseURL';
import { Share2, LinkIcon } from 'lucide-react';

interface ShareProps {
  mode?: 'overview' | 'comment';
  commentId?: string;
}

export default function Share({ mode = 'overview', commentId }: ShareProps) {
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const isOverview = mode === 'overview';
  const iconClass = isOverview ? 'h-5 w-5' : 'h-[18px] w-[18px]';
  const spanClass = isOverview ? 'text-sm' : 'text-xs';

  const onCopy = () => {
    if (!location.pathname) return;

    if (mode === 'comment') {
      void navigator.clipboard.writeText(
        `${getBaseURL(`${window.location.origin}${location.pathname}`)}/${commentId}`,
      );
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <button
      onClick={onCopy}
      className={`group relative px-3 transition-all hover:bg-hover-gray active:bg-active-gray ${
        isOverview
          ? 'interaction-button-wrapper'
          : 'h-8 rounded-full text-gray-400 transition-colors ease-in-out hover:text-white'
        }`}
    >
      <div className="gap-1 opacity-100 transition-opacity df group-hover:opacity-0">
        <Share2 className={iconClass} />
        <span className={spanClass}>Share</span>
      </div>

      <div
        className="absolute left-0 top-0 h-full w-full gap-1 opacity-0 transition-opacity df
          group-hover:opacity-100"
      >
        <LinkIcon className={iconClass} />
        <span className={spanClass}>{copied ? 'Copied' : 'Copy'}</span>
      </div>
    </button>
  );
}
