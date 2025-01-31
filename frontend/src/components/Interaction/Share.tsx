import { Share2 } from 'lucide-react';

export default function Share() {
  return (
    <button className="px-3 transition-all interaction-button-wrapper hover:bg-hover-gray active:bg-active-gray">
      <Share2 className="h-5 w-5" />

      <span className="text-sm">Share</span>
    </button>
  );
}
