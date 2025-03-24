import { SearchX } from 'lucide-react';

interface NoSearchResultsProps {
  notFoundName: string;
}

export default function NoSearchResults({ notFoundName }: NoSearchResultsProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-neutral-950 p-4">
      <SearchX className="h-10 w-10 flex-shrink-0" />

      <div className="flex flex-col gap-2">
        <div className="break-all text-lg">
          No results were found for &quot;{notFoundName}&quot;
        </div>

        <div className="text-sm text-gray-secondary">
          Double-check your spelling or try different keywords
        </div>
      </div>
    </div>
  );
}
