import { body, query } from 'express-validator/lib';

// prettier-ignore
class SavedPostsAndCommentsValidator {
  // Posts
  fetchSavedPostsRules() {
    return [
      query('cId').trim()
        .isString()
        .optional(),
    ];
  }

  savePostRules() {
    return [
      body('post_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Post ID is required'),
    ];
  }

  unsavePostRules() {
    return [
      body('post_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Post ID is required'),
    ];
  }

  // Comments
  fetchSavedCommentsRules() {
    return [
      query('cId').trim()
        .isString()
        .optional(),
    ];
  }

  saveCommentRules() {
    return [
      body('comment_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Comment ID is required'),
    ];
  }

  unsaveCommentRules() {
    return [
      body('comment_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Comment ID is required'),
    ];
  }
}

const savedPostsAndCommentsValidator = new SavedPostsAndCommentsValidator();
export default savedPostsAndCommentsValidator;
