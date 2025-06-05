import { Link } from 'react-router-dom';
import ChatOverview from '@/Main/Chats/components/ChatOverview/ChatOverview';
import { MessageCirclePlus } from 'lucide-react';

import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';

interface ChatSidebarProps {
  userId: string;
  currentChatId: string | null;
  chatOverviews: FetchedChatOverview[];
  showCreateChat: boolean;
  setShowCreateChat: (bool: boolean) => void;
  onOpenChat: (
    chatId: string,
    chatProperties: { name: string; pfp: string; isGroupChat: boolean },
  ) => void;
  loading: boolean;
}

export default function ChatSidebar({
  userId,
  currentChatId,
  chatOverviews,
  showCreateChat,
  setShowCreateChat,
  onOpenChat,
  loading,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden border-r-[0.5px]">
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img
              src="/logo.png"
              alt="reddnir logo"
              className="max-h-[32px] min-w-[32px]"
            />
          </Link>

          <h2 className="text-xl font-semibold">Chats</h2>
        </div>

        <div className="flex items-center">
          <button onClick={() => setShowCreateChat(!showCreateChat)}>
            <MessageCirclePlus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ChatOverview
        userSelfId={userId}
        currentChatId={currentChatId}
        chatOverviews={chatOverviews}
        onOpenChat={onOpenChat}
        loading={loading}
      />
    </div>
  );
}
