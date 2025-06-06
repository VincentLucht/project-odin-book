import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';

import { Pagination } from '@/interface/backendTypes';
import { APILoadingPhases } from '@/interface/misc';
import { DBChat, DBUserChats, DBMessage } from '@/interface/dbSchema';

// ! All calls are in chatRouter.ts, except fetchUsernames

interface UserSmall {
  id: string;
  username: string;
  profile_picture_url: string | null;
  deleted_at: string;
}

export interface ExistingOneOnOneChat {
  id: string;
  chat_id: string;
  owner_id: string;
  user1_id: string;
  user1: UserSmall;
  user2_id: string;
  user2: UserSmall;
}

export interface FetchedChatOverview {
  id: string;
  chat_id: string;
  is_muted: boolean;
  joined_at: string;
  user_id: string;
  last_read_at: string;

  chat: {
    id: string;
    name: string;
    profile_picture_url: string | null;
    is_group_chat: boolean;
    last_message_id: string | null;
    last_message: {
      user_id: string | null;
      user: { username: string | null };
      content: string;
      is_system_message: boolean;
      time_created: string;
    } | null;
    owner_id: string;
    updated_at: string;
    userChats: [DBUserChats]; // TODO: ???
    existing_one_on_one_chats?: [ExistingOneOnOneChat];
  };
}

interface FetchAllChatOverviewsResponse {
  message: string;
  chats: FetchedChatOverview[];
}
export async function fetchAllChatOverviews(
  token: string | null,
  cursorId: string,
  onComplete: (chats: FetchedChatOverview[]) => void,
) {
  try {
    const params = new URLSearchParams({
      cId: cursorId,
    });

    const response = await apiRequest<FetchAllChatOverviewsResponse>(
      `/chat/all?${params.toString()}`,
      'GET',
      token,
    );

    onComplete(response.chats);
  } catch (error) {
    catchError(error);
  }
}

export interface FetchedChat extends DBChat {
  existing_one_on_one_chats: [ExistingOneOnOneChat];
}
interface FetchChatResponse {
  message: string;
  chat: FetchedChat & { messages: DBMessage[] };
  pagination: Pagination;
}
export async function fetchChat(
  chat_id: string,
  token: string,
  onComplete: (
    chat: FetchedChat,
    messages: DBMessage[],
    pagination: Pagination,
  ) => void,
) {
  try {
    const params = new URLSearchParams({
      chat_id,
    });

    const response = await apiRequest<FetchChatResponse>(
      `/chat?${params.toString()}`,
      'GET',
      token,
    );

    const { messages, ...chatWithoutMessages } = response.chat;
    onComplete(chatWithoutMessages, messages, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

interface GetUnreadChatMessagesResponse {
  message: string;
  hasNewChatMessages: boolean;
}
export async function getUnreadChatMessages(
  token: string,
  onComplete: (hasNewMessages: boolean) => void,
) {
  try {
    const response = await apiRequest<GetUnreadChatMessagesResponse>(
      '/chat/unread',
      'GET',
      token,
    );

    onComplete(response.hasNewChatMessages);
  } catch (error) {
    catchError(error);
  }
}

interface ReadChatResponse {
  message: string;
}
export async function readChat(token: string, chat_id: string) {
  try {
    await apiRequest<ReadChatResponse>('/chat/read', 'POST', token, { chat_id });
  } catch (error) {
    catchError(error);
  }
}

interface CreateChatResponseType {
  id: string;
  name: string;
  time_created: string;
  profile_picture_url: string | null;
  is_group_chat: boolean;
  chat_description: string;
  updated_at: string;
  last_message_id: null;
  owner_id: string;
  userChats: [DBUserChats];
}
interface CreateChatResponse {
  message: string;
  chat: CreateChatResponseType;
}
export async function createChat(
  token: string | null,
  user2_username: string,
  messages: APILoadingPhases,
  onComplete: (chat: CreateChatResponseType) => void,
) {
  const toastId = toast.loading(messages.loading);

  try {
    const response = await apiRequest<CreateChatResponse>('/chat', 'POST', token, {
      user2_username,
    });
    toastUpdate(toastId, 'success', messages.success);
    onComplete(response.chat);
  } catch (error) {
    toastUpdate(toastId, 'error', messages.error);
    catchError(error);
  }
}

export async function muteChat(
  token: string,
  chat_id: string,
  is_muted: boolean,
  onComplete: () => void,
) {
  try {
    await apiRequest('/chat/mute', 'PUT', token, {
      chat_id,
      is_muted,
    });

    onComplete();
  } catch (error) {
    catchError(error);
  }
}

export async function leaveChat(
  token: string,
  chat_id: string,
  onComplete: () => void,
) {
  const toastId = toast.loading('Leaving chat...');

  try {
    await apiRequest('/chat', 'DELETE', token, { chat_id });

    toastUpdate(toastId, 'success', 'Successfully left chat');
    onComplete();
  } catch (error) {
    toastUpdate(toastId, 'error', 'Failed to leave chat');
    catchError(error);
  }
}

// ! call in userRouter.ts
export interface UserList {
  username: string;
  profile_picture_url: string | null;
  can_create_chat: boolean;
  already_has_chat: boolean;
}
export interface FetchUserNamesResponse {
  message: string;
  users: UserList[];
}
export async function fetchUsernames(
  token: string,
  username: string,
  onComplete: (users: UserList[]) => void,
) {
  try {
    const params = new URLSearchParams({
      u: username,
    });

    const response = await apiRequest<FetchUserNamesResponse>(
      `/user/list?${params.toString()}`,
      'GET',
      token,
    );

    onComplete(response.users);
  } catch (error) {
    catchError(error);
  }
}
