import { useState, useEffect, useCallback } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import { useNavigate } from 'react-router-dom';

import SavedApiFilters from '@/Main/Saved/components/SavedApiFilters';
import VirtualizedSaved from '@/Main/Saved/components/VirtualizedSaved';

import { fetchSavedPosts, fetchSavedComments } from '@/Main/Saved/api/savedApi';

import { SavedComment, DBPostWithCommunity } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

export default function Saved() {
  const [posts, setPosts] = useState<DBPostWithCommunity[]>([]);
  const [comments, setComments] = useState<SavedComment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: true,
    nextCursor: '',
  });

  const [typeFilter, setTypeFilter] = useState<'posts' | 'comments'>('posts');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, user } = useAuthGuard();

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      typeFilter === 'posts'
        ? void fetchSavedPosts(token, cursorId, (posts, pagination) => {
            setLoading(false);

            setPagination(pagination);
            isInitialFetch ? setPosts(posts) : setPosts((prev) => [...prev, ...posts]);
          })
        : void fetchSavedComments(token, cursorId, (comments, pagination) => {
            setLoading(false);

            setPagination(pagination);
            isInitialFetch
              ? setComments(comments)
              : setComments((prev) => [...prev, ...comments]);
          });
    },
    [token, typeFilter],
  );

  useEffect(() => {
    loadMore('', true);
  }, [loadMore]);

  return (
    <div className="p-4 h-full-header">
      <div className="center-main">
        <div className="w-full md:center-main-content">
          <div>
            <h1 className="mb-8 text-3xl font-semibold">Saved Posts & Comments</h1>

            <SavedApiFilters typeFilter={typeFilter} setTypeFilter={setTypeFilter} />

            <VirtualizedSaved
              posts={posts}
              setPosts={setPosts}
              comments={comments}
              setComments={setComments}
              typeFilter={typeFilter}
              pagination={pagination}
              loadMore={loadMore}
              loading={loading}
              navigate={navigate}
              token={token}
              userId={user.id}
            />
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
}
