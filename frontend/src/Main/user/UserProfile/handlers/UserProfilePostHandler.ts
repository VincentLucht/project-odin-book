import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

/**
 * Creates callback functions for Post edit API functions, uses {@link UserAndHistory} as the setter function type.
 *
 * Uses {@link CommunityPostManager} methods
 */
export default class UserProfilePostHandler {
  private postManager: CommunityPostManager;
  private setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
  constructor(
    postManager: CommunityPostManager,
    setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>,
  ) {
    this.postManager = postManager;
    this.setFetchedUser = setFetchedUser;
  }

  handleDeletePost = (postId: string) => {
    return () => {
      void this.postManager.deletePost(postId, (deletedPostId: string) => {
        this.setFetchedUser((prev) => {
          if (!prev) return prev;

          const updatedHistory = prev.history.filter(
            (post) => post.id !== deletedPostId,
          );

          return { ...prev, history: updatedHistory };
        });
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
        '', // TODO: Add community flair!
        (postId: string) => {
          this.setFetchedUser((prev) => {
            if (!prev) return prev;

            const updatedHistory = prev.history.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  is_spoiler: !(post as DBPostWithCommunityName).is_spoiler,
                  edited_at: new Date(),
                };
              }

              return post;
            });

            return { ...prev, history: updatedHistory };
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
        '', // TODO: Add community flair!
        (postId: string) => {
          this.setFetchedUser((prev) => {
            if (!prev) return prev;

            const updatedHistory = prev.history.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  is_mature: !(post as DBPostWithCommunityName).is_mature,
                  edited_at: new Date(),
                };
              }

              return post;
            });

            return { ...prev, history: updatedHistory };
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
          this.setFetchedUser((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              history: prev.history.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    post_assigned_flair: [],
                  };
                }

                return post;
              }),
            };
          });
        },
      );
    };
  };
}
