import { useState, useEffect, useCallback, useRef } from 'react';
import useGroupMessages from '@/Main/Chats/hooks/useGroupMessages';

import { Virtuoso } from 'react-virtuoso';
import ChatMessage from '@/Main/Chats/components/chat/components/ChatMessage';
import DateHeader from '@/Main/Chats/components/chat/components/DateHeader';
import ChatMessageLazy from '@/Main/Chats/components/chat/loading/ChatMessageLazy';

import { fetchChatMessages } from '@/Main/Chats/components/chat/api/messageAPI';

import { DBMessage } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

interface VirtualizedMessagesProps {
  token: string | null;
  chatId: string | null;
  userId: string;
  messages: DBMessage[];
  setMessages: React.Dispatch<React.SetStateAction<DBMessage[]>>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  retryMessage: (message: DBMessage) => Promise<void>;
}

export default function VirtualizedMessages({
  token,
  chatId,
  userId,
  messages,
  setMessages,
  pagination,
  setPagination,
  scrollContainerRef,
  retryMessage,
}: VirtualizedMessagesProps) {
  const [loading, setLoading] = useState(false);
  const groupedItems = useGroupMessages(messages);

  const handleScrollerRef = useCallback(
    (scrollWrapper: HTMLDivElement) => {
      scrollContainerRef.current = scrollWrapper;
    },
    [scrollContainerRef],
  );

  const lastWheelTime = useRef(0);
  const wheelRAF = useRef<number>();
  const handleWheelInvert = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      // Cancel previous RAF if still pending
      if (wheelRAF.current) {
        cancelAnimationFrame(wheelRAF.current);
      }

      // Use Request animation frame to avoid frequent updates
      wheelRAF.current = requestAnimationFrame(() => {
        const now = performance.now();
        if (now - lastWheelTime.current < 8) return; // 120fps max

        lastWheelTime.current = now;

        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop -= e.deltaY;
        }
      });
    },
    [scrollContainerRef],
  );

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheelInvert, {
        passive: false,
      });
    }

    return () => {
      if (wheelRAF.current) {
        cancelAnimationFrame(wheelRAF.current);
      }
      scrollContainer?.removeEventListener('wheel', handleWheelInvert);
    };
  }, [handleWheelInvert, scrollContainerRef]);

  const ItemRenderer = (index: number) => {
    const item = groupedItems[index];
    if (!item) return null;

    if (item.type === 'date') {
      return <DateHeader label={item.label} />;
    }

    return (
      <div data-id={item.message.id} style={{ transform: 'scaleY(-1)' }}>
        <ChatMessage message={item.message} retryMessage={retryMessage} />
      </div>
    );
  };

  useEffect(() => {
    // Reset scrolling to bottom
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }, 0);
  }, [chatId, scrollContainerRef]);

  return (
    <div style={{ transform: 'scaleY(-1)' }}>
      <Virtuoso
        data={groupedItems}
        itemContent={(index) => ItemRenderer(index)}
        overscan={200}
        computeItemKey={(index) => groupedItems[index]?.id || index.toString()}
        endReached={() => {
          if (pagination.hasMore && !loading && chatId && groupedItems.length > 0) {
            setLoading(true);
            void fetchChatMessages(
              token,
              chatId,
              pagination.nextCursor,
              (messages, pagination) => {
                setMessages((prev) => [...prev, ...messages]);
                setPagination(pagination);
                setLoading(false);
              },
            );
          }
        }}
        scrollerRef={handleScrollerRef as (ref: HTMLElement | Window | null) => never}
        components={{
          Footer: () =>
            loading && (
              <div style={{ transform: 'scaleY(-1)' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <ChatMessageLazy key={i} />
                ))}
              </div>
            ),
        }}
      />
    </div>
  );
}
