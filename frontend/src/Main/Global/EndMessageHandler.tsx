import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import EndMessage from '@/components/partials/EndMessage';

interface EndMessageHandlerProps {
  loading: boolean;
  hasMorePages: boolean;
  dataLength: number;
  endMessage?: string;
  noResultsMessage?: string;
  endMessageClassName?: string;
  noResultsClassName?: string;
  logoClassName?: string;
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
  endMessageClassName = '',
  noResultsClassName = '',
  logoClassName = '',
}: EndMessageHandlerProps) {
  return (
    <>
      {loading && <LogoLoading className={logoClassName} />}

      {!loading && !hasMorePages && dataLength > 0 && (
        <EndMessage message={endMessage} className={endMessageClassName} />
      )}

      {!loading && !hasMorePages && dataLength === 0 && (
        <EndMessage message={noResultsMessage} className={noResultsClassName} />
      )}
    </>
  );
}
