import { useState, useEffect } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import { useNavigate, useParams } from 'react-router-dom';

import fetchUserProfile, {
  UserAndHistory,
} from '@/Main/user/UserProfile/api/fetchUserProfile';
import isPost from '@/Main/user/UserProfile/util/isPost';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import UserSideBar from '@/Main/user/UserProfile/components/UserSidebar/UserSidebar';
import CommentOverview from '@/Main/CommentOverview/CommentOverview';
import UserNotFound from '@/components/partials/UserNotFound';

import { SortByUser } from '@/interface/backendTypes';
import { toast } from 'react-toastify';

// TODO: Make this work without being logged in!
export default function UserProfile() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortByUser>('new');
  const [fetchedUser, setFetchedUser] = useState<UserAndHistory | null>(null);
  const [showCommentDropdown, setShowCommentDropdown] = useState<string | null>(null);

  const { user, token } = useAuthGuard();

  const navigate = useNavigate();
  const path = useParams();
  const { username } = path;

  useEffect(() => {
    if (!username) return;

    fetchUserProfile(username, page, sortBy)
      .then((response) => {
        setFetchedUser(response.user);
      })
      .catch((error: { message: string }) => {
        if (error.message === 'User not found') {
          setFetchedUser(null);
        } else {
          toast.error('Failed to fetch user profile. Please try again later.');
        }
      });
  }, [username, page, sortBy]);

  return (
    <div className="center-main">
      <div className="center-main-content">
        {fetchedUser ? (
          <div className="w-full min-w-0">
            <div className="flex gap-2">
              {/* TODO: Img is a bit distorted?? use object-cover?? */}
              <img
                src={`${fetchedUser?.profile_picture_url ? fetchedUser?.profile_picture_url : '/user.svg'}`}
                alt="User Profile Pictures"
                className="h-24 w-24 rounded-full border-2"
              />
              <div className="flex-col df">
                <h2 className="text-xl font-bold">
                  {fetchedUser?.display_name
                    ? fetchedUser?.display_name
                    : fetchedUser?.username}
                </h2>
                <span className="w-full text-gray-secondary">
                  {fetchedUser?.username}
                </span>
              </div>
            </div>

            {Array.isArray(fetchedUser?.history) && fetchedUser.history.length > 0 ? (
              fetchedUser.history.map((value, index) =>
                isPost(value) ? (
                  <PostOverview
                    key={index}
                    post={value}
                    userId={user.id}
                    token={token}
                    setFetchedUser={setFetchedUser}
                    navigate={navigate}
                  />
                ) : (
                  <CommentOverview
                    key={index}
                    urlItems={{
                      communityName: value.post.community.name,
                      postId: value.post_id,
                      postName: value.post.title,
                    }}
                    comment={value}
                    userId={user.id}
                    token={token}
                    showCommentDropdown={showCommentDropdown}
                    setShowCommentDropdown={setShowCommentDropdown}
                    setFetchedUser={setFetchedUser}
                    navigate={navigate}
                  />
                ),
              )
            ) : (
              <p>No history found</p>
            )}
          </div>
        ) : (
          <UserNotFound />
        )}

        <UserSideBar user={fetchedUser} />
      </div>
    </div>
  );
}
