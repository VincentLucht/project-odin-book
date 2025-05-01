import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import EndMessage from '@/components/partials/EndMessage';

interface EndMessageHandlerProps {
  loading: boolean;
  hasMorePages: boolean;
  dataLength: number;
  endMessage?: string;
  noResultsMessage?: string;
  className?: string;
}

/**
 * Handles displaying end messages based on pagination and data state.
 */
export default function EndMessageHandler({
  loading,
  hasMorePages,
  dataLength,
  endMessage = "You've reached the end",
  noResultsMessage = 'No results found.',
  className = 'mt-14',
}: EndMessageHandlerProps) {
  return (
    <>
      {loading && <LogoLoading className="mt-8" />}
      {!loading && !hasMorePages && dataLength > 0 && (
        <EndMessage message={endMessage} className={className} />
      )}
      {!loading && !hasMorePages && dataLength === 0 && (
        <EndMessage message={noResultsMessage} />
      )}
    </>
  );
}
