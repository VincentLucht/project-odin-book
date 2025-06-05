import { useState, useEffect, useCallback } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import { fetchAllChatOverviews } from '@/Main/Chats/api/chatAPI';

import ChatSidebar from '@/Main/Chats/components/ChatSidebar/ChatSidebar';
import ChatCreation from '@/Main/Chats/components/ChatCreation';
import Chat from '@/Main/Chats/components/chat/Chat';

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
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const { user, token } = useAuthGuard();

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

  const onOpenChat = (
    chatId: string,
    chatProperties: { name: string; pfp: string | null; isGroupChat: boolean },
  ) => {
    setShowCreateChat(false);
    setCurrentChatId(chatId);
    const chatOverview = chatOverviews.find((overview) => overview.chat_id === chatId);
    setCurrentChatOverview(chatOverview ?? null);

    const { name, pfp, isGroupChat } = chatProperties;
    setTempChat({ name, pfp: pfp ?? '', isGroupChat });
  };

  useEffect(() => {
    loadAllChatOverviews('', true);
  }, [loadAllChatOverviews]);

  return (
    <div className="grid h-dvh grid-cols-[300px_auto]">
      <ChatSidebar
        userId={user?.id}
        currentChatId={currentChatId}
        chatOverviews={chatOverviews}
        showCreateChat={showCreateChat}
        setShowCreateChat={setShowCreateChat}
        onOpenChat={onOpenChat}
        loading={loading}
      />

      {showCreateChat ? (
        <ChatCreation
          token={token}
          user={user}
          setChats={setChatOverviews}
          setShowCreateChat={setShowCreateChat}
          onOpenChat={onOpenChat}
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
        />
      )}
    </div>
  );
}
