import { FetchedChatOverview, ExistingOneOnOneChat } from '@/Main/Chats/api/chatAPI';

/** Extracts chat information from an {@link FetchedChatOverview} Object, including profile picture, name, group chat status, and mode. */
export function getChatDisplayProps(overview: FetchedChatOverview, userSelfId: string) {
  if (overview.chat.is_group_chat) {
    return {
      chatName: overview.chat.name,
      pfp: overview.chat.profile_picture_url,
      mode: 'community' as const,
      isGroupChat: true,
    };
  }

  const oneOnOneChat = overview.chat.existing_one_on_one_chats?.[0];
  if (!oneOnOneChat) {
    return {
      chatName: overview.chat.name,
      pfp: null,
      mode: 'user' as const,
      isGroupChat: false,
    };
  }

  const otherUser =
    oneOnOneChat.user1_id === userSelfId ? oneOnOneChat.user2 : oneOnOneChat.user1;
  return {
    chatName: otherUser.deleted_at ? '[Deleted User]' : otherUser.username,
    pfp: otherUser.profile_picture_url,
    mode: 'user' as const,
    isGroupChat: false,
  };
}

/** Extracts the info from the other user in a one-on-one chat from an {@link ExistingOneOnOneChat} Object, including profile picture and pfp */
export function getOneOnOneChatDisplayProps(
  existingOneOnOneChat: ExistingOneOnOneChat | undefined,
  userSelfId: string,
) {
  if (!existingOneOnOneChat) return null;

  const otherUser =
    existingOneOnOneChat.user1_id === userSelfId
      ? existingOneOnOneChat.user2
      : existingOneOnOneChat.user1;

  return {
    username: otherUser.deleted_at ? '[deleted]' : otherUser.username,
    pfp: otherUser.profile_picture_url,
  };
}
