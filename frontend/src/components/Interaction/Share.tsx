import { Share2 } from 'lucide-react';

interface ShareProps {
  mode?: 'overview' | 'comment';
}

export default function Share({ mode = 'overview' }: ShareProps) {
  const isOverview = mode === 'overview';

  return (
    <button
      className={`px-3 transition-all hover:bg-hover-gray active:bg-active-gray ${
        isOverview
          ? 'interaction-button-wrapper'
          : `flex h-8 items-center gap-1 rounded-full text-gray-400 transition-colors ease-in-out
            hover:text-white`
        }`}
    >
      <Share2 className={`${isOverview ? 'h-5 w-5' : 'h-[18px] w-[18px]'}`} />

      <span className={`${isOverview ? 'text-sm' : 'text-xs'} `}>Share</span>
    </button>
  );
}
