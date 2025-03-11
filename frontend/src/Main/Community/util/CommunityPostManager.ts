/* eslint-disable @typescript-eslint/no-unused-vars */
import deletePost from '@/Main/Post/api/delete/deletePost';
import { toast } from 'react-toastify';
import catchError from '@/util/catchError';

import confirmAction from '@/util/confirmAction';
import editPost from '@/Main/Post/api/edit/editPost';

import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import UserProfilePostHandler from '@/Main/user/UserProfile/handlers/UserProfilePostHandler';

/**
 * Handles API calls related to posts, like deleting a post.
 *
 * Called by {@link CommunityPostHandler} and {@link UserProfilePostHandler}.
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
    flairId: string | null,
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;

    editPost(postId, body, !isSpoiler, isMature, flairId, this.token!)
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
    flairId: string | null,
    cb: (postId: string) => void,
  ) {
    if (!this.isLoggedIn()) return;

    editPost(postId, body, isSpoiler, !isMature, flairId, this.token!)
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
}
