import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import UserSideBar from '@/Main/user/UserProfile/components/UserSidebar/UserSidebar';
import VirtualizedUserHistory from '@/Main/user/UserProfile/components/VirtualizedUserHistory';
import UserProfileApiFilters from '@/Main/user/UserProfile/components/UserProfileApiFilters';
import UserProfileLazy from '@/Main/user/UserProfile/UserProfileLazy';
import ShowHideButton from '@/Main/Global/ShowHideButton';

import fetchUserProfile, {
  UserHistoryItem,
} from '@/Main/user/UserProfile/api/fetchUserProfile';
import { toast } from 'react-toastify';

import { SortByUser } from '@/interface/backendTypes';
import { DBUser } from '@/interface/dbSchema';

export interface UserProfilePagination {
  hasMore: boolean;
  nextCursor: {
    lastId: string;
    lastScore: number | null;
    lastDate: string | null;
  };
}
export type UserProfileFilters = 'both' | 'posts' | 'comments';
export interface UserHistoryUser extends DBUser {
  chatProperties: {
    canCreate: boolean;
    existsOneOnOne: boolean;
    chatId: string | undefined;
  };
}

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortByUser>('new');
  const [typeFilter, setTypeFilter] = useState<'both' | 'posts' | 'comments'>('both');
  const [pagination, setPagination] = useState<UserProfilePagination>({
    hasMore: true,
    nextCursor: {
      lastId: '',
      lastScore: null,
      lastDate: null,
    },
  });
  const [fetchedUser, setFetchedUser] = useState<UserHistoryUser | null>(null);
  const [userHistory, setUserHistory] = useState<UserHistoryItem[] | null>(null);

  const { user, token } = useAuth();
  const { isMobile } = useGetScreenSize();
  const [showSidebar, setShowSidebar] = useState(false);

  const path = useParams();
  const { username } = path;

  const loadMore = useCallback(
    (pagination: UserProfilePagination, initialFetch: boolean) => {
      if (!username) return;
      setLoading(true);

      fetchUserProfile(
        token,
        { username, sort_by_type: sortBy },
        { typeFilter, initialFetch },
        pagination,
      )
        .then((response) => {
          if (initialFetch) {
            setFetchedUser(response.user);
            setUserHistory(response.history);
          } else {
            setUserHistory((prev) => [...(prev ?? []), ...(response.history ?? [])]);
          }

          setPagination(response.pagination);
          setLoading(false);
        })
        .catch((error: { message: string }) => {
          if (error.message === 'User not found') {
            setFetchedUser(null);
          } else {
            toast.error('Failed to fetch user profile. Please try again later.');
          }
          setLoading(false);
        });
    },
    [username, typeFilter, sortBy, token],
  );

  useEffect(() => {
    loadMore(
      { hasMore: true, nextCursor: { lastId: '', lastScore: null, lastDate: null } },
      true,
    );
  }, [loadMore]);

  if (loading && !fetchedUser) {
    return <UserProfileLazy />;
  }

  return (
    <div className="h-[100dvh + 56px] p-4">
      <div className="center-main">
        <div className="w-full md:center-main-content">
          <div className="w-full min-w-0">
            {fetchedUser && (
              <div>
                <div className="flex gap-2">
                  <img
                    src={`${fetchedUser?.profile_picture_url ? fetchedUser?.profile_picture_url : '/user.svg'}`}
                    alt="User Profile Pictures"
                    className="h-24 w-24 rounded-full border-2 object-cover"
                  />

                  <div className="flex-col df">
                    <h2 className="text-xl font-bold">
                      {fetchedUser?.display_name ?? fetchedUser?.username}
                    </h2>

                    {fetchedUser?.display_name && (
                      <span className="w-full text-gray-secondary">
                        u/{fetchedUser?.username}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <UserProfileApiFilters
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                  />

                  {isMobile && (
                    <ShowHideButton
                      show={showSidebar}
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="mb-2 mt-4"
                      label="about"
                    />
                  )}
                </div>
              </div>
            )}

            {(!isMobile || !showSidebar) && (
              <VirtualizedUserHistory
                token={token}
                fetchedUser={fetchedUser}
                user={user}
                userHistory={userHistory ?? []}
                setUserHistory={setUserHistory}
                pagination={pagination}
                loadMore={loadMore}
                loading={loading}
              />
            )}
          </div>

          {(!isMobile || showSidebar) && (
            <UserSideBar userSelfId={user?.id} user={fetchedUser} />
          )}
        </div>
      </div>
    </div>
  );
}
