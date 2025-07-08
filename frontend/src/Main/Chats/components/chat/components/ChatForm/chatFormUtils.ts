import { DBMessage } from '@/interface/dbSchema';
import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';
import { toast } from 'react-toastify';

export async function sendChatMessageOptimistic(
  chatId: string,
  message: string,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setMessages: React.Dispatch<React.SetStateAction<DBMessage[]>>,
  setChatOverviews: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>,
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  token: string,
  userSelf: { id: string; profile_picture_url: string | null; username: string },
  sendChatMessage: (
    token: string,
    chatId: string,
    message: string,
  ) => Promise<DBMessage>,
  isResend = false,
) {
  // Optimist message
  const tempId = `temp-${new Date().toISOString()}`;
  const tempMessage: DBMessage = {
    id: tempId,
    chat_id: chatId,
    content: message,
    is_system_message: false,
    time_created: new Date().toISOString(),
    iv: '',
    user: {
      id: userSelf.id,
      username: userSelf.username,
      profile_picture_url: userSelf.profile_picture_url,
      deleted_at: null,
    },
    user_id: userSelf.id,
    status: 'pending',
  };
  setMessages((prev) => [tempMessage, ...prev]);
  setMessage('');

  try {
    const newMessage = await sendChatMessage(token, chatId, message);

    setMessages((prev) =>
      prev.map((chatMessage) =>
        chatMessage.id === tempId ? { ...newMessage, status: 'sent' } : chatMessage,
      ),
    );

    // Scroll to bottom
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    // Mark chat as newest + last message
    setChatOverviews((prev) => {
      const index = prev.findIndex((overview) => overview.chat_id === chatId);
      if (index === -1) return prev;

      const overview = prev[index];
      const updatedOverview = {
        ...overview,
        chat: {
          ...overview.chat,
          updated_at: new Date().toISOString(),
          last_message_id: 'temp',
          last_message: {
            user_id: userSelf.id,
            user: { username: userSelf.username },
            is_system_message: false,
            content: message,
            time_created: new Date().toISOString(),
          },
        },
      };

      return [updatedOverview, ...prev.slice(0, index), ...prev.slice(index + 1)];
    });

    if (isResend) {
      toast.success('Message sent successfully on retry');
    }
  } catch (error) {
    setMessages((prev) =>
      prev.map((chatMessage) =>
        chatMessage.id === tempId ? { ...tempMessage, status: 'failed' } : chatMessage,
      ),
    );
  }
}

export async function retryMessage(
  message: DBMessage,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setMessages: React.Dispatch<React.SetStateAction<DBMessage[]>>,
  setChatOverviews: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>,
  scrollContainerRef: React.RefObject<HTMLDivElement>,
  token: string,
  userSelf: { id: string; profile_picture_url: string | null; username: string },
  sendChatMessage: (
    token: string,
    chatId: string,
    message: string,
  ) => Promise<DBMessage>,
) {
  setMessages((prev) => prev.filter((chatMessage) => chatMessage.id !== message.id));

  await sendChatMessageOptimistic(
    message.chat_id,
    message.content,
    setMessage,
    setMessages,
    setChatOverviews,
    scrollContainerRef,
    token,
    userSelf,
    sendChatMessage,
    true,
  );
}
