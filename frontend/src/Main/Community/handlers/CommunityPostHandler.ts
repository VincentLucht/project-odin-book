import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

/**
 * Creates callback functions for Post edit API functions, uses {@link DBPostWithCommunityName} as the setter function type.
 * Reduces code repetition across used components by reusing state code blocks.
 *
 * Uses {@link CommunityPostManager} methods.
 */
export default class CommunityPostHandler<
  T extends {
    id: string;
    body: string;
    is_spoiler: boolean;
    is_mature: boolean;
    edited_at?: Date;
    post_assigned_flair: { id: string; community_flair: { id: string } }[];
  },
> {
  private postManager: CommunityPostManager;
  private setPosts: React.Dispatch<React.SetStateAction<T[]>>;

  constructor(
    postManager: CommunityPostManager,
    setPosts: React.Dispatch<React.SetStateAction<T[]>>,
  ) {
    this.postManager = postManager;
    this.setPosts = setPosts;
  }

  handleDeletePost = (postId: string) => {
    void this.postManager.deletePost(postId, (deletedPostId: string) => {
      this.setPosts((prev) => {
        if (!prev) return prev;

        return prev.filter((post) => post.id !== deletedPostId);
      });
    });
  };

  handleSpoilerFunc = (post: T) => {
    this.postManager.toggleSpoiler(
      post.id,
      post.body,
      post.is_spoiler,
      post.is_mature,
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

  handleMatureFunc = (post: T) => {
    this.postManager.toggleMature(
      post.id,
      post.body,
      post.is_spoiler,
      post.is_mature,
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

  handleDeletePostFlair = (post: T, navigateToEdit: () => void) => {
    if (!post.post_assigned_flair.length) {
      navigateToEdit();
      return;
    }

    this.postManager.deletePostFlair(
      post.id,
      post.post_assigned_flair[0].community_flair.id,
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

  handleManageSavedPost = (postId: string, userId: string, save: boolean) => {
    const action = save ? 'save' : 'unsave';

    void this.postManager.manageSavedPost(postId, action, (postId) => {
      this.setPosts((prev) => {
        if (!prev) return prev;

        return prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                saved_by: save ? [{ user_id: userId }] : [],
              }
            : post,
        );
      });
    });
  };
}
