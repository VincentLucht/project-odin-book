import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import CommunityOverview from '@/Main/SearchResults/components/DisplaySearchResults/components/CommunityOverview';
import NoSearchResults from '@/Main/SearchResults/components/DisplaySearchResults/components/NoSearchResults';
import PostOverviewSearch from '@/Main/SearchResults/components/DisplaySearchResults/components/PostOverviewSearch';
import UserOverview from '@/Main/SearchResults/components/DisplaySearchResults/components/UserOverview';
import InfiniteLoader from '@/components/InfiniteLoader';

import { DBPostSearch, QueryType } from '@/Main/SearchResults/SearchResults';
import { DBCommunity, DBUser } from '@/interface/dbSchema';
import CommentOverviewSearch, {
  DBCommentSearch,
} from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearch';

interface DisplaySearchResultsProps {
  query: string | null;
  queryType: QueryType;
  posts: DBPostSearch[];
  communities: DBCommunity[];
  comments: DBCommentSearch[];
  users: DBUser[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function DisplaySearchResults({
  query,
  queryType,
  posts,
  communities,
  comments,
  users,
  loading,
  hasMore,
  loadMore,
}: DisplaySearchResultsProps) {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loaderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loadMore, loading],
  );

  if (!query) return null;

  if (queryType === 'posts') {
    if (posts?.length === 0) {
      return <NoSearchResults notFoundName={query} />;
    }

    return (
      <div>
        {posts?.map((post) => (
          <PostOverviewSearch
            key={post.id}
            post={{
              id: post.id,
              name: post.title,
              total_votes: post.total_vote_score,
              total_comments: post.total_comment_score,
              created_at: post.created_at,
              is_spoiler: post.is_spoiler,
              is_mature: post.is_mature,
              image_url: '', // TODO: If post type is images, show that image => CENSOR IF MATURE OR SPOILER
            }}
            community={{
              name: post.community.name,
              is_mature: post.is_mature,
              profile_picture_url: post.community.profile_picture_url,
            }}
            navigate={navigate}
          />
        ))}

        <InfiniteLoader hasMore={hasMore} loading={loading} ref={loaderRef} />
      </div>
    );
  }

  if (queryType === 'communities') {
    if (communities?.length === 0) {
      return <NoSearchResults notFoundName={query} />;
    }

    return (
      <div>
        {communities?.map((community) => (
          <CommunityOverview
            key={community.name}
            name={community.name}
            description={community.description}
            member_amount={community.total_members}
            profile_picture_url={community.profile_picture_url}
            is_mature={community.is_mature}
            type={community.type}
            navigate={navigate}
          />
        ))}

        <InfiniteLoader hasMore={hasMore} loading={loading} ref={loaderRef} />
      </div>
    );
  }

  // Comments
  if (queryType === 'comments') {
    if (comments?.length === 0) {
      return <NoSearchResults notFoundName={query} />;
    }

    return (
      <div>
        {comments?.map((comment) => (
          <CommentOverviewSearch
            key={comment.id}
            comment={comment}
            navigate={navigate}
          />
        ))}

        <InfiniteLoader hasMore={hasMore} loading={loading} ref={loaderRef} />
      </div>
    );
  }

  if (queryType === 'people') {
    if (users?.length === 0) {
      return <NoSearchResults notFoundName={query} />;
    }

    return (
      <div>
        {users?.map((user) => (
          <UserOverview key={user.username} user={user} navigate={navigate} />
        ))}

        <InfiniteLoader hasMore={hasMore} loading={loading} ref={loaderRef} />
      </div>
    );
  }
}
