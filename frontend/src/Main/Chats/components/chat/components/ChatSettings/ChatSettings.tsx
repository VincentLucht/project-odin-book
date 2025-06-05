import { useState, useMemo } from 'react';

import PFP from '@/components/PFP';
import { BellIcon, LogOutIcon } from 'lucide-react';
import ChatSettingsNotificationToggle from '@/Main/Chats/components/chat/components/ChatSettings/ChatSettingsNotificationToggle';

import { leaveChat } from '@/Main/Chats/api/chatAPI';

import { FetchedChat, FetchedChatOverview } from '@/Main/Chats/api/chatAPI';
import { Link } from 'react-router-dom';
import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

interface ChatSettingsProps {
  userSelfId: string;
  token: string;
  chat: FetchedChat | null;
  setChat: React.Dispatch<React.SetStateAction<FetchedChat | null>>;
  setShowChatSettings: React.Dispatch<React.SetStateAction<boolean>>;
  currentChatOverview: FetchedChatOverview | null;
  setChatOverviews: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>;
  setCurrentChatOverview: React.Dispatch<
    React.SetStateAction<FetchedChatOverview | null>
  >;
  setTempChat: React.Dispatch<
    React.SetStateAction<{
      name: string;
      pfp: string;
      isGroupChat: boolean;
    }>
  >;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ChatSettings({
  userSelfId,
  token,
  chat,
  setChat,
  setShowChatSettings,
  currentChatOverview,
  setChatOverviews,
  setCurrentChatOverview,
  setTempChat,
  setCurrentChatId,
}: ChatSettingsProps) {
  const [showLeaveChatModal, setShowLeaveChatModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const otherUser = useMemo(() => {
    if (!chat || chat.is_group_chat) return null;

    const users = chat.existing_one_on_one_chats[0];

    if (users?.user1_id !== userSelfId) {
      return users?.user1;
    } else {
      return users?.user2;
    }
  }, [chat, userSelfId]);

  if (!chat && !otherUser) return null;

  return (
    <div className="w-[374px] border-l-[0.5px]">
      <div className="flex h-[44px] w-full items-center justify-between border-b-[0.5px] px-3">
        <div className="font-semibold">Chat Settings</div>

        <button onClick={() => setShowChatSettings((prev) => !prev)}></button>
      </div>

      {chat?.is_group_chat ? (
        <div>Group chats soon</div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="my-4 flex-col gap-2 px-3 pt-3 df">
            <PFP
              src={otherUser?.profile_picture_url}
              className="!h-16 !w-16"
              mode={chat?.is_group_chat ? 'community' : 'user'}
            />

            {otherUser?.deleted_at ? (
              <div>[Deleted User]</div>
            ) : (
              <Link
                to={`/user/${otherUser?.username}`}
                className="break-all font-semibold hover:underline"
              >
                u/{otherUser?.username}
              </Link>
            )}
          </div>

          <div className="flex w-full items-center justify-between px-7 py-2">
            <div className="flex w-full items-center gap-3">
              <BellIcon className="min-h-6 min-w-6" />

              <ChatSettingsNotificationToggle
                token={token}
                isMuted={currentChatOverview?.is_muted ?? true}
                chatId={chat?.id}
                setChatOverviews={setChatOverviews}
                setCurrentChatOverview={setCurrentChatOverview}
              />
            </div>
          </div>

          <button
            className="flex w-full items-center gap-3 px-7 py-2 bg-transition-hover"
            onClick={() => setShowLeaveChatModal(true)}
          >
            <LogOutIcon className="min-h-6 min-w-6 text-red-500" />

            <div className="text-red-500">Leave Chat</div>
          </button>

          <Modal show={showLeaveChatModal} onClose={() => setShowLeaveChatModal(false)}>
            <ModalHeader
              headerName="Are you sure you want to leave this one-on-one chat?"
              description="This action is irreversible, however, you, or the user, can create a chat with each other again."
              onClose={() => setShowLeaveChatModal(false)}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (chat?.id) {
                  setSubmitting(true);

                  void leaveChat(token, chat.id, () => {
                    setSubmitting(false);
                    setShowChatSettings(false);
                    setShowLeaveChatModal(false);

                    setCurrentChatOverview(null);
                    setChat(null);
                    setCurrentChatId(null);
                    setTempChat({ name: '', pfp: '', isGroupChat: false });
                    setChatOverviews((prev) =>
                      prev.filter((overview) => overview.chat_id !== chat.id),
                    );
                  });
                }
              }}
            >
              <ModalFooter
                submitting={submitting}
                confirmButtonName="Leave Chat"
                confirmButtonClassName="!cancel-button"
                cancelButtonClassName="!confirm-button"
                onClose={() => setShowLeaveChatModal(false)}
              />
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}
