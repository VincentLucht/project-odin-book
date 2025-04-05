import { useCallback } from 'react';

export type GenericOnComplete<T> = (
  data?: T[],
  cursorId?: string,
  hasMore?: boolean,
  isRefetch?: boolean,
) => void;

export function useCompletionHandler() {
  return useCallback(
    <T>(
      data?: T[],
      setData?: React.Dispatch<React.SetStateAction<T[]>>,
      cursorId?: string,
      setCursorId?: React.Dispatch<React.SetStateAction<string>>,
      hasMore?: boolean,
      setHasMore?: React.Dispatch<React.SetStateAction<boolean>>,
      setLoading?: React.Dispatch<React.SetStateAction<boolean>>,
      isRefetch = false,
    ) => {
      if (data) {
        if (isRefetch) {
          setData && setData(data);
        } else {
          setData &&
            setData((prev) => {
              if (!prev) return prev;
              return [...prev, ...data];
            });
        }
      }

      if (cursorId !== undefined) setCursorId && setCursorId(cursorId);
      if (hasMore !== undefined) setHasMore && setHasMore(hasMore);
      setLoading && setLoading(false);
    },
    [],
  );
}
