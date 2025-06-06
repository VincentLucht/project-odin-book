import PFP from '@/components/PFP';
import ChatOverviewLazy from '@/Main/Chats/components/ChatOverview/ChatOverviewLazy';

import { getChatDisplayProps } from '@/Main/Chats/components/ChatOverview/util/chatUtils';
import dayjs from 'dayjs';

import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';

interface ChatProps {
  userSelfId: string;
  currentChatId: string | null;
  chatOverviews: FetchedChatOverview[];
  onOpenChat: (
    chatId: string,
    chatProperties: { name: string; pfp: string; isGroupChat: boolean },
  ) => void;
  loading: boolean;
}

export default function ChatOverview({
  userSelfId,
  currentChatId,
  chatOverviews,
  onOpenChat,
  loading,
}: ChatProps) {
  if (loading) {
    return <ChatOverviewLazy />;
  }

  return (
    <div className="mt-1 overflow-y-scroll">
      {!chatOverviews.length && (
        <div className="mt-3 text-sm df">
          Start a conversation to see your chats here!
        </div>
      )}

      {chatOverviews.map((overview) => {
        const { chatName, pfp, mode, isGroupChat } = getChatDisplayProps(
          overview,
          userSelfId,
        );

        const lastMessage = overview.chat.last_message;
        const hasUnreadMessages = lastMessage
          ? lastMessage?.time_created > overview.last_read_at &&
            lastMessage.user_id !== userSelfId
          : false;

        return (
          <button
            key={overview.id}
            className={`flex min-h-[60px] w-full items-center gap-2 px-3 py-2 bg-transition-hover
            ${currentChatId === overview.chat_id && 'bg-accent-gray'}`}
            onClick={() =>
              onOpenChat(overview.chat_id, {
                name: chatName,
                pfp: pfp ?? '',
                isGroupChat,
              })
            }
          >
            <PFP src={pfp} mode={mode} className="!h-8 !w-8" />

            {overview.chat.last_message_id && overview.chat.last_message ? (
              <div className="w-full min-w-0 text-xs">
                <div className="flex items-center justify-between gap-1">
                  <div className="text-left text-sm text-hidden-ellipsis">
                    {chatName}
                  </div>

                  <div className="flex-shrink-0 text-gray-secondary">
                    {dayjs(overview.chat.last_message.time_created).format('MMM D')}
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-1">
                  <div className="text-left text-hidden-ellipsis text-gray-secondary">
                    {overview.chat.last_message.user_id === userSelfId
                      ? 'You'
                      : overview.chat.last_message.user.username}
                    : {overview.chat.last_message.content}
                  </div>

                  {hasUnreadMessages && (
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-1 min-w-0 self-start text-left text-sm">
                {chatName}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
