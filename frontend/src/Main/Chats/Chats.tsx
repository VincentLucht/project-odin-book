import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import useMeasure from 'react-use-measure';

import ChatSidebar from '@/Main/Chats/components/ChatSidebar/ChatSidebar';
import ChatCreation from '@/Main/Chats/components/ChatCreation';
import Chat from '@/Main/Chats/components/chat/Chat';

import { fetchAllChatOverviews, readChat } from '@/Main/Chats/api/chatAPI';
import { getChatDisplayProps } from '@/Main/Chats/components/ChatOverview/util/chatUtils';

import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';
import { Pagination } from '@/interface/backendTypes';

export default function Chats() {
  const [tempChat, setTempChat] = useState({ name: '', pfp: '', isGroupChat: false });
  const [chatOverviews, setChatOverviews] = useState<FetchedChatOverview[]>([]);
  const [currentChatOverview, setCurrentChatOverview] =
    useState<FetchedChatOverview | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: true,
    nextCursor: '',
  });

  const [loading, setLoading] = useState(true);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const prevChatIdRef = useRef<string | null>(null);
  const openedFirstChat = useRef(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token } = useAuthGuard();
  const { isMobile } = useGetScreenSize();
  const [ref, { width }] = useMeasure();

  const loadAllChatOverviews = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      void fetchAllChatOverviews(token, cursorId, (chats) => {
        if (isInitialFetch) {
          setChatOverviews(chats);
        } else {
          setChatOverviews((prev) => [...prev, ...chats]);
        }

        setLoading(false);
      });
    },
    [token],
  );

  const onOpenChat = useCallback(
    (
      chatId: string,
      chatProperties: { name: string; pfp: string | null; isGroupChat: boolean },
    ) => {
      setShowCreateChat(false);

      // ? Mark CURRENT chat as read
      void readChat(token, chatId);
      // ? Mark PREVIOUS chat as read
      if (prevChatIdRef.current && prevChatIdRef.current !== chatId) {
        void readChat(token, prevChatIdRef.current);
      }

      setCurrentChatId(chatId);
      prevChatIdRef.current = chatId;

      const chatOverview = chatOverviews.find(
        (overview) => overview.chat_id === chatId,
      );
      setCurrentChatOverview(chatOverview ?? null);
      setChatOverviews((prev) =>
        prev.map((overview) =>
          overview.chat_id === chatId
            ? { ...overview, last_read_at: new Date().toISOString() }
            : overview,
        ),
      );

      const { name, pfp, isGroupChat } = chatProperties;
      setTempChat({ name, pfp: pfp ?? '', isGroupChat });
    },
    [chatOverviews, token],
  );

  useEffect(() => {
    loadAllChatOverviews('', true);
  }, [loadAllChatOverviews]);

  // Mark as read when leaving/closing chat
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (prevChatIdRef.current) {
        void readChat(token, prevChatIdRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (prevChatIdRef.current) {
        void readChat(token, prevChatIdRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [token]);

  // Handle chat creation/opening from props
  useEffect(() => {
    const createChatUsername = searchParams.get('createChat');
    if (createChatUsername) {
      setShowCreateChat(true);
      setSearchUsername(createChatUsername);

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('createChat');
        return newParams;
      });
    }

    const openChatId = searchParams.get('openChat');
    if (openChatId && chatOverviews.length > 0) {
      const overview = chatOverviews.find(
        (overview) => overview.chat_id === openChatId,
      );

      if (overview) {
        const { chatName, pfp, isGroupChat } = getChatDisplayProps(overview, user.id);

        onOpenChat(openChatId, {
          name: chatName,
          pfp,
          isGroupChat,
        });
      } else {
        // Fallback
        setCurrentChatId(openChatId);
      }

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('openChat');
        return newParams;
      });
    }
  }, [searchParams, setSearchParams, chatOverviews, onOpenChat, user.id]);

  // Open first chat on open
  useEffect(() => {
    if (chatOverviews && !openedFirstChat.current && !isMobile && !showCreateChat) {
      const latestChatOverview = chatOverviews[0];
      if (latestChatOverview) {
        const { chatName, pfp, isGroupChat } = getChatDisplayProps(
          latestChatOverview,
          user.id,
        );
        onOpenChat(latestChatOverview.chat_id, { name: chatName, pfp, isGroupChat });
        openedFirstChat.current = true;
      }
    }
  }, [chatOverviews, onOpenChat, user, isMobile, showCreateChat]);

  return (
    <div className={`grid h-dvh ${isMobile ? '' : 'grid-cols-[300px_auto]'}`} ref={ref}>
      {/* Desktop: Always show sidebar
          Mobile: Show sidebar only when no currentChatId*/}
      {(!isMobile || !currentChatId) && (
        <ChatSidebar
          userId={user?.id}
          currentChatId={currentChatId}
          chatOverviews={chatOverviews}
          showCreateChat={showCreateChat}
          setShowCreateChat={setShowCreateChat}
          onOpenChat={onOpenChat}
          loading={loading}
        />
      )}

      {/* Desktop: Always show
          Mobile: Show only if there is chat id */}
      {((!isMobile || currentChatId) ?? showCreateChat) && (
        <>
          {showCreateChat ? (
            <ChatCreation
              token={token}
              user={user}
              searchUsername={searchUsername}
              setSearchUsername={setSearchUsername}
              setChats={setChatOverviews}
              setShowCreateChat={setShowCreateChat}
              onOpenChat={onOpenChat}
              isMobile={isMobile}
            />
          ) : (
            <Chat
              tempChat={tempChat}
              setTempChat={setTempChat}
              currentChatId={currentChatId}
              setCurrentChatId={setCurrentChatId}
              userSelfId={user?.id}
              token={token}
              setChatOverviews={setChatOverviews}
              pagination={pagination}
              setPagination={setPagination}
              currentChatOverview={currentChatOverview}
              setCurrentChatOverview={setCurrentChatOverview}
              isMobile={isMobile}
              isDesktop={width >= 1000}
            />
          )}
        </>
      )}
    </div>
  );
}
