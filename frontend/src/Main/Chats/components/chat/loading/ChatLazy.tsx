import { useCallback, useEffect, useRef } from 'react';
import { useSkeletonRandomValues } from '@/Main/Post/components/Loading/hook/useSkeletonRandomValuesProps';

import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import ChatMessageLazy from '@/Main/Chats/components/chat/loading/ChatMessageLazy';

export default function ChatLazy() {
  const { usernameLength } = useSkeletonRandomValues();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const lastWheelTime = useRef(0);
  const wheelRAF = useRef<number>();
  const handleWheelInvert = useCallback((e: WheelEvent) => {
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
  }, []);

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
  }, [handleWheelInvert]);

  return (
    <div className="grid h-dvh">
      <div className="grid grid-rows-[44px_1fr_auto]">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-2 border-b-[0.5px] px-3">
          <div className="flex items-center gap-2">
            <PFPLazy className="h-8 w-8" />

            <LazyCompartment height={18} width={usernameLength + 20} />
          </div>
          <LazyCompartment height={20} width={20} className="mr-2 !rounded-full" />
        </div>

        {/* MESSAGES  */}
        <div
          ref={scrollContainerRef}
          className="flex h-[calc(100dvh-100px)] flex-col overflow-y-auto"
          style={{
            transform: 'scaleY(-1)',
          }}
        >
          <div style={{ transform: 'scaleY(-1)' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <ChatMessageLazy key={i} />
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-3 p-2 pr-4">
          <LazyCompartment height={40} className="w-full !rounded-full" />
          <LazyCompartment height={24} width={30} className="!rounded-full" />
        </div>
      </div>
    </div>
  );
}
