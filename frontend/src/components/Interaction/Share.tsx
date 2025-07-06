import { useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import slugify from 'slugify';

import { Share2, LinkIcon } from 'lucide-react';

import getBaseURL from '@/Main/Post/components/CommentSection/util/getBaseURL';
import getCommentThreadUrl from '@/util/getCommentThreadUrl';

export interface UrlItems {
  communityName: string;
  postId: string;
  postName: string;
}

interface ShareProps {
  mode?: 'overview' | 'comment' | 'post';
  commentId?: string;
  urlItems?: UrlItems;
  smallMode?: boolean;
  postInfo?: {
    postId: string;
    postTitle: string;
    communityName: string;
  };
}

export default function Share({
  mode = 'overview',
  commentId,
  urlItems,
  smallMode = false,
  postInfo,
}: ShareProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const { parentCommentId } = useParams();

  const isOverview = mode === 'overview' || mode === 'post';
  const iconClass = isOverview ? 'h-5 w-5' : 'h-[18px] w-[18px]';
  const spanClass = isOverview ? 'text-sm' : 'text-xs';

  const onCopy = () => {
    if (!location.pathname) return;

    if (mode === 'comment') {
      if (parentCommentId) {
        void navigator.clipboard.writeText(
          `${window.location.origin}${getBaseURL(`${location.pathname}`)}/${commentId}`,
        );
      } else {
        if (urlItems && commentId) {
          void navigator.clipboard.writeText(getCommentThreadUrl(urlItems, commentId));
        } else {
          void navigator.clipboard.writeText(
            `${`${window.location.origin}${location.pathname}/${commentId}`}`,
          );
        }
      }
    }

    const getPostUrl = (postInfo: {
      postId: string;
      postTitle: string;
      communityName: string;
    }) => {
      const { postId, postTitle, communityName } = postInfo;
      return `${window.location.origin}/r/${communityName}/${postId}/${slugify(postTitle, { lower: true })}`;
    };

    if (mode === 'post') {
      const url = postInfo ? getPostUrl(postInfo) : window.location.href;
      void navigator.clipboard.writeText(url);
    }
    if (mode === 'overview' && postInfo) {
      void navigator.clipboard.writeText(getPostUrl(postInfo));
    }

    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
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

        {!smallMode && <span className={spanClass}>Share</span>}
      </div>

      <div
        className="absolute left-0 top-0 h-full w-full gap-1 opacity-0 transition-opacity df
          group-hover:opacity-100"
      >
        <LinkIcon className={iconClass} />

        {!smallMode && <span className={spanClass}>{copied ? 'Copied' : 'Copy'}</span>}
      </div>
    </button>
  );
}
