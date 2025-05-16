import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

/**
 * Creates callback functions for Post edit API functions, uses {@link UserHistoryItem} as the setter function type.
 *
 * Uses {@link CommunityPostManager} methods
 */
export default class UserProfilePostHandler {
  private postManager: CommunityPostManager;
  private setUserHistory: React.Dispatch<
    React.SetStateAction<UserHistoryItem[] | null>
  >;
  constructor(
    postManager: CommunityPostManager,
    setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>,
  ) {
    this.postManager = postManager;
    this.setUserHistory = setUserHistory;
  }

  handleDeletePost = (postId: string) => {
    return () => {
      void this.postManager.deletePost(postId, (deletedPostId: string) => {
        this.setUserHistory(
          (prev) => prev?.filter((item) => item.id !== deletedPostId) ?? null,
        );
      });
    };
  };

  handleSpoilerFunc = (post: DBPostWithCommunityName) => {
    return () => {
      void this.postManager.toggleSpoiler(
        post.id,
        post.body,
        post.is_spoiler,
        post.is_mature,
        (postId: string) => {
          this.setUserHistory((prev) => {
            if (!prev) return prev;
            return prev.map((item) => {
              if (item.id === postId && item.item_type === 'post') {
                return {
                  ...item,
                  is_spoiler: !item.is_spoiler,
                  edited_at: new Date(),
                };
              }
              return item;
            });
          });
        },
      );
    };
  };

  handleMatureFunc = (post: DBPostWithCommunityName) => {
    return () => {
      void this.postManager.toggleSpoiler(
        post.id,
        post.body,
        post.is_spoiler,
        post.is_mature,
        (postId: string) => {
          this.setUserHistory((prev) => {
            if (!prev) return prev;
            return prev.map((item) => {
              if (item.id === postId && item.item_type === 'post') {
                return {
                  ...item,
                  is_mature: !item.is_mature,
                  edited_at: new Date(),
                };
              }
              return item;
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
      if (!post.post_assigned_flair?.length) {
        navigateToEdit();
        return;
      }
      this.postManager.deletePostFlair(
        post.id,
        post.post_assigned_flair[0].id,
        (postId) => {
          this.setUserHistory((prev) => {
            if (!prev) return prev;
            return prev.map((item) => {
              if (item.id === postId) {
                return {
                  ...item,
                  post_assigned_flair: [],
                };
              }
              return item;
            });
          });
        },
      );
    };
  };
}
