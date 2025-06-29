import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import EndMessage from '@/components/partials/EndMessage';
import { ReactNode } from 'react';

interface EndMessageHandlerProps {
  loading: boolean;
  hasMorePages: boolean;
  dataLength: number;
  endMessage?: string;
  noResultsMessage?: string;
  endMessageClassName?: string;
  noResultsClassName?: string;
  logoClassName?: string;
  noResultsComponent?: ReactNode;
  loadingComponent?: ReactNode;
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
  noResultsComponent,
  loadingComponent,
}: EndMessageHandlerProps) {
  return (
    <>
      {loading &&
        (loadingComponent ? (
          <>{loadingComponent}</>
        ) : (
          <LogoLoading className={logoClassName} />
        ))}
      {!loading && !hasMorePages && dataLength > 0 && (
        <EndMessage message={endMessage} className={endMessageClassName} />
      )}
      {!loading &&
        !hasMorePages &&
        dataLength === 0 &&
        (noResultsComponent ? (
          <>{noResultsComponent}</>
        ) : (
          <EndMessage message={noResultsMessage} className={noResultsClassName} />
        ))}
    </>
  );
}
