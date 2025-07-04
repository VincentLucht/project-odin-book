import deletePost from '@/Main/Post/api/delete/deletePost';
import { toast } from 'react-toastify';
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

    deletePost(postId, this.token!)
      .then(() => {
        toast.success('Successfully deleted post');
        cb(postId);
      })
      .catch((error) => {
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

    editPost(postId, body, !isSpoiler, isMature, this.token!)
      .then(() => {
        toast.success(
          isSpoiler
            ? 'Successfully removed spoiler tag from post'
            : 'Successfully added spoiler tag to post',
        );

        cb(postId);
      })
      .catch((error) => {
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

    editPost(postId, body, isSpoiler, !isMature, this.token!)
      .then(() => {
        toast.success(
          isMature
            ? 'Successfully removed NSFW tag from post'
            : 'Successfully added NSFW tag to post',
        );

        cb(postId);
      })
      .catch((error) => {
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

    deletePostFlair(postId, post_assigned_flair_id, this.token!)
      .then(() => {
        toast.success('Successfully removed post flair');

        cb(postId);
      })
      .catch((error) => {
        catchError(error);
      });
  }

  async manageSavedPost(
    post_id: string,
    action: 'save' | 'unsave',
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;

    try {
      const method = action === 'save' ? 'POST' : 'DELETE';
      await apiRequest('/post/save', method, this.token, { post_id });
      toast.success(
        action === 'save'
          ? 'Successfully saved this post'
          : 'Successfully removed post from saved',
      );
      cb(post_id);
    } catch (error) {
      catchError(error);
    }
  }
}
