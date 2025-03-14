import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

/**
 * Creates callback functions for Post edit API functions, uses {@link DBPostWithCommunityName} as the setter function type.
 *
 * Uses {@link CommunityPostManager} methods.
 */
export default class CommunityPostHandler {
  private postManager: CommunityPostManager;
  private setPosts: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  constructor(
    postManager: CommunityPostManager,
    setPosts: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>,
  ) {
    this.postManager = postManager;
    this.setPosts = setPosts;
  }

  handleDeletePost = (postId: string) => {
    return () => {
      void this.postManager.deletePost(postId, (deletedPostId: string) => {
        this.setPosts((prev) => {
          if (!prev) return prev;

          return prev.filter((post) => post.id !== deletedPostId);
        });
      });
    };
  };

  handleSpoilerFunc = (post: DBPostWithCommunityName) => {
    return () => {
      this.postManager.toggleSpoiler(
        post.id,
        post.body,
        post.is_spoiler,
        post.is_mature,
        '', // TODO: Add community flair??
        (postId) => {
          this.setPosts((prev) => {
            if (!prev) return prev;

            return prev.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  is_spoiler: !post.is_spoiler,
                  edited_at: new Date(),
                };
              }

              return post;
            });
          });
        },
      );
    };
  };

  handleMatureFunc = (post: DBPostWithCommunityName) => {
    return () => {
      this.postManager.toggleMature(
        post.id,
        post.body,
        post.is_spoiler,
        post.is_mature,
        '', // TODO: Add community flair
        (postId) => {
          this.setPosts((prev) => {
            if (!prev) return prev;

            return prev.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  is_mature: !post.is_mature,
                  edited_at: new Date(),
                };
              }

              return post;
            });
          });
        },
      );
    };
  };

  handleDeletePostFlair = (
    post: DBPostWithCommunityName,
    navigateToEdit: () => void,
  ) => {
    return () => {
      if (!post.post_assigned_flair.length) {
        navigateToEdit();
        return;
      }

      this.postManager.deletePostFlair(
        post.id,
        post.post_assigned_flair[0].id,
        (postId) => {
          this.setPosts((prev) => {
            if (!prev) return prev;

            return prev.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  post_assigned_flair: [],
                };
              }

              return post;
            });
          });
        },
      );
    };
  };
}
