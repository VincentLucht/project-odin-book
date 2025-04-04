import { body, param, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isPostTypeValid from '@/post/util/isPostTypeValid';
import isSortByValid from '@/util/isSortByValid';

// prettier-ignore
class PostValidator {
  fetchRules() {
    return [
      param('post_id').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),
    ];
  }

  getByRules() {
    return [
      query('cyId').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),
      query('sbt').trim()
        .custom((type: string) => {
          return isSortByValid(type);
        }),

    ];
  }

  creationRules() {
    return [
      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('title').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('title', 1))
        .isLength({ max: 300 })
        .withMessage(vm.maxLen('title', 300)),

      body('body').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('body', 1))
        .isLength({ max: 40000 })
        .withMessage(vm.maxLen('body', 40000)),

      body('is_spoiler')
        .isBoolean(),

      body('is_mature')
        .isBoolean(),

      body('type')
        .custom((type: string) => {
          return isPostTypeValid(type);
        }),
    ];
  }

  editRules() {
    return [
      body('post_id').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),

      body('body').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('body', 1))
        .isLength({ max: 40000 })
        .withMessage(vm.maxLen('body', 40000)),

      body('is_spoiler')
        .isBoolean(),

      body('is_mature')
        .isBoolean(),
    ];
  }

  deleteRules() {
    return [
      body('post_id').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),
    ];
  }
}

const postValidator = new PostValidator();
export default postValidator;
