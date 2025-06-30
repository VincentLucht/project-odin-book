import { body, query } from 'express-validator/lib';

// prettier-ignore
class SavedPostsAndCommentsValidator {
  // Posts
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
