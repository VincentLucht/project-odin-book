import { useState, useEffect, useRef } from 'react';

import PFP from '@/components/PFP';
import VirtualizedMessages from '@/Main/Chats/components/chat/components/VirtualizedMessages';
import ChatSettings from '@/Main/Chats/components/chat/components/ChatSettings/ChatSettings';
import TextareaAutosize from 'react-textarea-autosize';
import ChatLazy from '@/Main/Chats/components/chat/loading/ChatLazy';
import { SendHorizontalIcon } from 'lucide-react';
import { SettingsIcon } from 'lucide-react';

import { fetchChat, FetchedChat } from '@/Main/Chats/api/chatAPI';
import { sendChatMessage } from '@/Main/Chats/components/chat/api/messageAPI';

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
  userSelfId: string;
  token: string;
  setChatOverviews: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  currentChatOverview: FetchedChatOverview | null;
  setCurrentChatOverview: React.Dispatch<
    React.SetStateAction<FetchedChatOverview | null>
  >;
}

export default function Chat({
  tempChat,
  setTempChat,
  currentChatId,
  setCurrentChatId,
  userSelfId,
  token,
  setChatOverviews,
  pagination,
  setPagination,
  currentChatOverview,
  setCurrentChatOverview,
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

  if (!chat && !tempChat.name) {
    return <ChatLazy />;
  }

  return (
    <div className={`grid h-dvh ${showChatSettings && 'grid-cols-[auto_374px]'}`}>
      <div className="grid grid-rows-[44px_1fr_auto]">
        <div className="flex items-center justify-between border-b-[0.5px] px-3">
          <div className="flex items-center gap-2 font-semibold">
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
          userId={userSelfId}
          messages={messages}
          setMessages={setMessages}
          pagination={pagination}
          setPagination={setPagination}
          loading={loading}
          setLoading={setLoading}
          scrollContainerRef={scrollContainerRef}
        />

        <form
          className="relative flex min-h-[56px] gap-3 p-2 pr-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (chat && message) {
              void sendChatMessage(token, chat.id, message, (newMessage) => {
                setMessages((prev) => [newMessage, ...prev]);
                setMessage('');

                // Scroll to bottom
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTop = 0;
                }

                // Mark chat as newest + last message
                setChatOverviews((prev) => {
                  const index = prev.findIndex(
                    (overview) => overview.chat_id === chat.id,
                  );
                  if (index === -1) return prev;

                  const overview = prev[index];
                  const updatedOverview = {
                    ...overview,
                    chat: {
                      ...overview.chat,
                      updated_at: new Date().toISOString(),
                      last_message_id: 'temp',
                      last_message: {
                        user_id: userSelfId,
                        user: { username: 'temp' },
                        is_system_message: false,
                        content: message,
                        time_created: new Date().toISOString(),
                      },
                    },
                  };

                  return [
                    updatedOverview,
                    ...prev.slice(0, index),
                    ...prev.slice(index + 1),
                  ];
                });
              });
            }
          }}
        >
          <div
            className="h-full w-full rounded-3xl py-[10px] df bg-accent-gray hover:cursor-text"
            onClick={() => document.getElementById('send-message-textarea')?.focus()}
          >
            <TextareaAutosize
              className="ml-4 mr-1 w-full pr-4 text-sm bg-accent-gray focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name="message-textarea"
              id="send-message-textarea"
              autoFocus
              autoComplete="off"
              placeholder="Message"
              style={{ resize: 'none', scrollPadding: '10px' }}
              maxRows={5}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
          </div>

          <div className="min-w-6"></div>

          <button
            className={`fixed bottom-4 right-4 ${showChatSettings && 'mr-[374px]'}`}
            type="submit"
          >
            <SendHorizontalIcon
              className={`transition-colors ${!message ? 'text-[#374151]' : 'text-blue-500'}`}
              fill={`${!message ? '#374151' : '#3b82f6'}`}
            />
          </button>
        </form>
      </div>

      {showChatSettings && (
        <ChatSettings
          userSelfId={userSelfId}
          token={token}
          chat={chat}
          setChat={setChat}
          setShowChatSettings={setShowChatSettings}
          currentChatOverview={currentChatOverview}
          setCurrentChatOverview={setCurrentChatOverview}
          setChatOverviews={setChatOverviews}
          setTempChat={setTempChat}
          setCurrentChatId={setCurrentChatId}
        />
      )}
    </div>
  );
}
