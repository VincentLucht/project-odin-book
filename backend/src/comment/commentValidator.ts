import { body, query, param } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class CommentValidator {
  fetchRules() {
    return [
      query('pId').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),

      query('sbt').trim()
        .custom((sort_by_type) => {
          if (!sort_by_type) {
            throw new Error('Sort by type is required');
          }

          if (sort_by_type !== 'top' && sort_by_type !== 'new') {
            throw new Error('Incorrect sort by type');
          }

          return true;
        }),
    ];
  }

  fetchMoreRules() {
    return [
      param('post_id').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),

      param('parent_comment_id').trim()
        .notEmpty()
        .withMessage(vm.req('Parent Comment ID')),
    ];
  }

  creationRules() {
    return [
      body('content').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('content', 1))
        .isLength({ max: 10000 })
        .withMessage(vm.maxLen('content', 10000)),

      body('post_id').trim()
      .notEmpty()
      .withMessage(vm.postIdReq()),
    ];
  }

  updateRules() {
    return [
      body('comment_id').trim()
        .notEmpty()
        .withMessage(vm.req('Comment ID')),

      body('new_content').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('content', 1))
        .isLength({ max: 10000 })
        .withMessage(vm.maxLen('content', 10000)),
    ];
  }

  deletionRules() {
    return [
      body('comment_id').trim()
        .notEmpty()
        .withMessage(vm.req('Comment ID')),
    ];
  }
}

const commentValidator = new CommentValidator();
export default commentValidator;
