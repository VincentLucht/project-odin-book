import { useMemo } from 'react';
import { getOneOnOneChatDisplayProps } from '@/Main/Chats/components/ChatOverview/util/chatUtils';
import { FetchedChat } from '@/Main/Chats/api/chatAPI';

// TODO: Not used anymore
export default function useChatDisplayProps(
  chat: FetchedChat | null,
  userSelfId: string,
) {
  return useMemo(() => {
    if (!chat) return { chatName: null, pfp: null };

    const isGroupChat = chat.is_group_chat;

    if (isGroupChat) {
      return {
        chatName: chat.name,
        pfp: chat.profile_picture_url,
        isGroupChat,
      };
    } else {
      const otherUser = getOneOnOneChatDisplayProps(
        chat.existing_one_on_one_chats[0],
        userSelfId,
      );

      return {
        chatName: otherUser?.username,
        pfp: otherUser?.pfp,
        isGroupChat,
      };
    }
  }, [chat, userSelfId]);
}
