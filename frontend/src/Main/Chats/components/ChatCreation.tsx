import { useState, useEffect } from 'react';
import PFP from '@/components/PFP';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import { ChevronLeftIcon, LockIcon, MessageCircleHeartIcon } from 'lucide-react';

import { fetchUsernames, createChat, UserList } from '@/Main/Chats/api/chatAPI';
import { toast } from 'react-toastify';

import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';
import { TokenUser } from '@/context/auth/AuthProvider';

interface ChatCreationProps {
  token: string;
  user: TokenUser;
  searchUsername: string;
  setSearchUsername: React.Dispatch<React.SetStateAction<string>>;
  setChats: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>;
  setShowCreateChat: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChat: (
    chatId: string,
    chatProperties: {
      name: string;
      pfp: string;
      isGroupChat: boolean;
    },
  ) => void;
  isMobile: boolean;
}

export default function ChatCreation({
  token,
  user: userSelf,
  searchUsername,
  setSearchUsername,
  setChats,
  setShowCreateChat,
  onOpenChat,
  isMobile,
}: ChatCreationProps) {
  const [selectedUser, setSelectedUser] = useState<{
    username: string;
    already_has_chat: boolean;
  }>({ username: '', already_has_chat: false });
  const [foundUsers, setFoundUsers] = useState<UserList[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchUsername) {
      setFoundUsers([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      void fetchUsernames(token, searchUsername, (users) => {
        setFoundUsers(users);
        users.length === 0 ? setNoResults(true) : setNoResults(false);
        setLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchUsername, token]);
  const handleUserSelect = (username: string, already_has_chat: boolean) => {
    setSelectedUser((prev) =>
      username === prev.username
        ? { username: '', already_has_chat: false }
        : { username, already_has_chat },
    );
  };

  return (
    <div className="flex h-dvh flex-col items-center">
      <div className="font- flex min-h-[43px] w-full items-center border-b-[0.5px] pl-3">
        {isMobile && (
          <button
            className="mr-2 bg-hover-transition"
            onClick={() => setShowCreateChat(false)}
          >
            <ChevronLeftIcon className="h-7 w-7" />
          </button>
        )}

        <div className="font-semibold">New Chat</div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <label htmlFor="search-username-input">
          Type username
          <span className="text-red-500">*</span>
        </label>

        <input
          id="search-username-input"
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="w-[300px] rounded-full px-4 py-2"
          autoComplete="off"
          autoFocus
        />

        <span className="text-xs text-gray-secondary">
          Search for people by username to chat with them.
        </span>
      </div>

      <div className="my-4 h-full min-w-[300px] overflow-y-scroll rounded-lg bg-accent-gray">
        {loading ? (
          <div className="flex justify-center">
            <LogoLoading className="mt-4" />
          </div>
        ) : (
          <>
            {noResults ? (
              <div className="p-4 text-center">
                <div>No users with this username found.</div>

                <div className="mt-2 text-sm">
                  <div>Are you sure this is</div>
                  <div>the correct username?</div>
                </div>
              </div>
            ) : (
              foundUsers.map((user) => (
                <button
                  key={user.username}
                  className={`flex w-full items-center justify-between px-4 py-2 ${ !user.can_create_chat &&
                    'cursor-default' }`}
                  onClick={() => {
                    if (user.can_create_chat && user.username !== userSelf.username) {
                      handleUserSelect(user.username, user.already_has_chat);
                    } else if (user.username === userSelf.username) {
                      const toastId = 'toast-chat-creation-self';
                      if (!toast.isActive(toastId)) {
                        toast('You can not create a chat with yourself!', { toastId });
                      }
                    } else {
                      const toastId = 'toast-chat-creation';
                      if (!toast.isActive(toastId)) {
                        toast('This user disabled chat creation', { toastId });
                      }
                    }
                  }}
                >
                  <div className="flex gap-3 text-hidden-ellipsis">
                    <PFP src={user.profile_picture_url} />
                    {user.username}
                  </div>

                  {userSelf.username === user.username ? (
                    <div className="user-indicator-self">You</div>
                  ) : user.can_create_chat ? (
                    <div className="flex items-center gap-2">
                      {user.already_has_chat && (
                        <MessageCircleHeartIcon className="ml-2 h-5 w-5 text-red-500" />
                      )}

                      <input
                        type="checkbox"
                        checked={selectedUser.username === user.username}
                        readOnly
                      />
                    </div>
                  ) : (
                    <LockIcon className="h-5 w-5 text-red-600" />
                  )}
                </button>
              ))
            )}
          </>
        )}
      </div>

      {selectedUser && (
        <button
          className={`fixed bottom-0 right-0 mb-2 mr-2 h-8 prm-button-blue ${
          !selectedUser.username || selectedUser.already_has_chat
              ? '!bg-gray-inactive'
              : 'im active'
          }`}
          onClick={() => {
            if (selectedUser.username && !selectedUser.already_has_chat) {
              void createChat(
                token,
                selectedUser.username,
                {
                  loading: 'Creating chat...',
                  success: 'Successfully created chat',
                  error: 'Failed to create chat',
                },
                (chat) => {
                  setChats((prev) => [
                    // Transform into UserChats object
                    {
                      ...chat.userChats[0],
                      chat: { ...chat, last_message: null },
                      last_read_at: new Date().toISOString(),
                    },
                    ...prev,
                  ]);
                  // ? Change for group chats
                  const user = foundUsers.find(
                    (user) => user.username === selectedUser.username,
                  );
                  if (user) {
                    onOpenChat(chat.id, {
                      name: user.username,
                      pfp: user?.profile_picture_url ?? '',
                      isGroupChat: false,
                    });
                  }

                  setFoundUsers([]);
                  setSearchUsername('');
                  setSelectedUser({ username: '', already_has_chat: false });
                  setShowCreateChat(false);
                },
              );
            }
          }}
        >
          {selectedUser.username && selectedUser.already_has_chat
            ? 'You already have a chat with this user'
            : 'Create Chat'}
        </button>
      )}
    </div>
  );
}
