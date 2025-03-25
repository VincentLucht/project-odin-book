import { forwardRef } from 'react';
import EndMessage from '@/components/partials/EndMessage';

interface InfiniteLoaderProps {
  hasMore: boolean;
  loading: boolean;
}

const InfiniteLoader = forwardRef<HTMLDivElement, InfiniteLoaderProps>(
  ({ hasMore, loading }, ref) => {
    return (
      <div>
        {!hasMore && <EndMessage />}

        {loading && (
          <div className="df">
            <div className="spinner-dots mb-4 mt-2"></div>
          </div>
        )}

        <div ref={ref} className="-mt-[1000px] h-0" />
      </div>
    );
  },
);

InfiniteLoader.displayName = 'InfiniteLoader';

export default InfiniteLoader;
