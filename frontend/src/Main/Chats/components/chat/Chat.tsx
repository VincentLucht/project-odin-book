import { useState, useEffect, useRef } from 'react';

import PFP from '@/components/PFP';
import VirtualizedMessages from '@/Main/Chats/components/chat/components/VirtualizedMessages';
import ChatSettings from '@/Main/Chats/components/chat/components/ChatSettings/ChatSettings';
import ChatLazy from '@/Main/Chats/components/chat/loading/ChatLazy';
import ChatPlaceholder from '@/Main/Chats/components/chat/components/ChatPlaceholder';
import ChatMessageForm from '@/Main/Chats/components/chat/components/ChatForm/ChatForm';
import { ChevronLeftIcon } from 'lucide-react';
import { SettingsIcon } from 'lucide-react';

import { fetchChat, FetchedChat } from '@/Main/Chats/api/chatAPI';
import { sendChatMessage } from '@/Main/Chats/components/chat/api/messageAPI';
import {
  sendChatMessageOptimistic,
  retryMessage as retryMessageFunc,
} from '@/Main/Chats/components/chat/components/ChatForm/chatFormUtils';

import '@/Main/Chats/components/chat/css/hideLine.css';
import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';
import { DBMessage } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

interface ChatProps {
  tempChat: { name: string; pfp: string; isGroupChat: boolean };
  setTempChat: React.Dispatch<
    React.SetStateAction<{
      name: string;
      pfp: string;
      isGroupChat: boolean;
    }>
  >;
  currentChatId: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  userSelf: { id: string; profile_picture_url: string | null; username: string };
  token: string;
  setChatOverviews: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  currentChatOverview: FetchedChatOverview | null;
  setCurrentChatOverview: React.Dispatch<
    React.SetStateAction<FetchedChatOverview | null>
  >;
  isMobile: boolean;
  isDesktop: boolean;
}

export default function Chat({
  tempChat,
  setTempChat,
  currentChatId,
  setCurrentChatId,
  userSelf,
  token,
  setChatOverviews,
  pagination,
  setPagination,
  currentChatOverview,
  setCurrentChatOverview,
  isMobile,
  isDesktop,
}: ChatProps) {
  const [chat, setChat] = useState<FetchedChat | null>(null);
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChat = async (currentChatId: string) => {
      setLoading(true);
      await fetchChat(currentChatId, token, (chat, messages, pagination) => {
        setChat(chat);
        setMessages(messages);
        setPagination(pagination);
        setLoading(false);
      });
    };

    if (currentChatId) {
      void loadChat(currentChatId);
    }
  }, [currentChatId, token, setPagination, setChat]);

  if (!currentChatId) {
    return <ChatPlaceholder />;
  }

  if (loading) {
    return <ChatLazy />;
  }

  const sendMessage = async () => {
    if (!chat || !message) return;

    await sendChatMessageOptimistic(
      chat.id,
      message,
      setMessage,
      setMessages,
      setChatOverviews,
      scrollContainerRef,
      token,
      userSelf,
      sendChatMessage,
    );
  };

  const retryMessage = async (message: DBMessage) => {
    if (!chat || !message) return;

    await retryMessageFunc(
      message,
      setMessage,
      setMessages,
      setChatOverviews,
      scrollContainerRef,
      token,
      userSelf,
      sendChatMessage,
    );
  };

  return (
    <div
      className={`grid h-dvh ${showChatSettings && isDesktop ? 'grid-cols-[auto_374px]' : 'grid-cols-1'}`}
    >
      <div
        className={`grid grid-rows-[44px_1fr_auto] ${!isDesktop && showChatSettings ? 'hidden' : ''}`}
      >
        <div className="flex items-center justify-between border-b-[0.5px] px-3">
          <div className="flex items-center gap-2 font-semibold">
            {isMobile && (
              <button className="bg-hover-transition">
                <ChevronLeftIcon
                  className="!h-7 !w-7"
                  onClick={() => {
                    setCurrentChatId(null);
                    setChat(null);
                    setTempChat({ name: '', pfp: '', isGroupChat: false });
                  }}
                />
              </button>
            )}

            <PFP
              src={!tempChat.pfp ? null : tempChat.pfp}
              className="!h-[32px] !w-[32px]"
              mode={tempChat.isGroupChat ? 'community' : 'user'}
            />

            <div>{tempChat.name}</div>
          </div>

          <button
            className="!h-8 !w-8 bg-hover-transition"
            onClick={() => {
              if (chat) {
                setShowChatSettings((prev) => !prev);
              }
            }}
          >
            <SettingsIcon strokeWidth={1.5} className="h-5 w-5" />
          </button>
        </div>

        <VirtualizedMessages
          token={token}
          chatId={currentChatId}
          userId={userSelf.id}
          messages={messages}
          setMessages={setMessages}
          pagination={pagination}
          setPagination={setPagination}
          scrollContainerRef={scrollContainerRef}
          retryMessage={retryMessage}
        />

        <ChatMessageForm
          message={message}
          setMessage={setMessage}
          showChatSettings={showChatSettings}
          sendMessage={sendMessage}
        />
      </div>

      {showChatSettings && (
        <ChatSettings
          userSelfId={userSelf.id}
          token={token}
          chat={chat}
          setChat={setChat}
          setShowChatSettings={setShowChatSettings}
          currentChatOverview={currentChatOverview}
          setCurrentChatOverview={setCurrentChatOverview}
          setChatOverviews={setChatOverviews}
          setTempChat={setTempChat}
          setCurrentChatId={setCurrentChatId}
          isDesktop={isDesktop}
        />
      )}
    </div>
  );
}
