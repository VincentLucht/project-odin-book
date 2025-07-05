import deletePost from '@/Main/Post/api/delete/deletePost';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import catchError from '@/util/catchError';

import confirmAction from '@/util/confirmAction';
import editPost from '@/Main/Post/api/edit/editPost';
import deletePostFlair from '@/Main/Post/components/PostFlairTag/api/deletePostFlair';
import apiRequest from '@/util/apiRequest';

import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';

/**
 * Handles API calls related to posts, like deleting a post.
 *
 * Called by {@link CommunityPostHandler}.
 */
export default class CommunityPostManager {
  public token: string | null;
  constructor(token: string | null) {
    this.token = token;
  }

  isLoggedIn() {
    if (!this.token) {
      toast.error('You are not logged in');
      return false;
    }

    return true;
  }

  async deletePost(postId: string, cb: (postId: string) => void) {
    if (!this.isLoggedIn()) return;
    if (
      !(await confirmAction('Are you sure you want to delete your post?', 'Delete'))
    ) {
      return;
    }

    const toastId = toast.loading('Deleting post...');

    deletePost(postId, this.token!)
      .then(() => {
        toastUpdate(toastId, 'success', 'Successfully deleted post');

        cb(postId);
      })
      .catch((error) => {
        toastUpdate(toastId, 'error', 'Failed to delete post');
        catchError(error);
      });
  }

  toggleSpoiler(
    postId: string,
    body: string,
    isSpoiler: boolean,
    isMature: boolean,
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;
    const toastId = toast.loading(
      isSpoiler ? 'Removing spoiler tag...' : 'Adding spoiler tag...',
    );

    editPost(postId, body, !isSpoiler, isMature, this.token!)
      .then(() => {
        toastUpdate(
          toastId,
          'success',
          isSpoiler
            ? 'Successfully removed spoiler tag from post'
            : 'Successfully added spoiler tag to post',
        );

        cb(postId);
      })
      .catch((error) => {
        toastUpdate(
          toastId,
          'error',
          isSpoiler ? 'Failed to remove spoiler tag' : 'Failed to add spoiler tag',
        );
        catchError(error);
      });
  }

  toggleMature(
    postId: string,
    body: string,
    isSpoiler: boolean,
    isMature: boolean,
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;
    const toastId = toast.loading(
      isMature ? 'Removing NSFW tag...' : 'Adding NSFW tag...',
    );

    editPost(postId, body, isSpoiler, !isMature, this.token!)
      .then(() => {
        toastUpdate(
          toastId,
          'success',
          isMature
            ? 'Successfully removed NSFW tag from post'
            : 'Successfully added NSFW tag to post',
        );

        cb(postId);
      })
      .catch((error) => {
        toastUpdate(
          toastId,
          'error',
          isMature ? 'Failed to remove NSFW tag' : 'Failed to add NSFW tag',
        );
        catchError(error);
      });
  }

  deletePostFlair(
    postId: string,
    post_assigned_flair_id: string,
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;
    if (!post_assigned_flair_id) return;

    const toastId = toast.loading('Removing post flair...');

    deletePostFlair(postId, post_assigned_flair_id, this.token!)
      .then(() => {
        toastUpdate(toastId, 'success', 'Successfully removing post flair');
        cb(postId);
      })
      .catch((error) => {
        toastUpdate(toastId, 'error', 'Failed to remove post flair');
        catchError(error);
      });
  }

  async manageSavedPost(
    post_id: string,
    action: 'save' | 'unsave',
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;

    const toastId = toast.loading(
      action === 'save' ? 'Saving post...' : 'Removing post from saved...',
    );

    try {
      const method = action === 'save' ? 'POST' : 'DELETE';
      await apiRequest('/post/save', method, this.token, { post_id });
      const successMessage =
        action === 'save'
          ? 'Successfully saved this post'
          : 'Successfully removed post from saved';

      toastUpdate(toastId, 'success', successMessage);
      cb(post_id);
    } catch (error) {
      const errorMessage =
        action === 'save' ? 'Failed to save post' : 'Failed to remove post';
      toastUpdate(toastId, 'error', errorMessage);
      catchError(error);
    }
  }
}
