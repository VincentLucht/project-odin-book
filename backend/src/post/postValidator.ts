import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isPostTypeValid from '@/post/util/isPostTypeValid';

// prettier-ignore
class PostValidator {
  creationRules() {
    return [
      body('community_id')
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('title')
        .isLength({ min: 1 })
        .withMessage(vm.minLen('title', 1))
        .isLength({ max: 300 })
        .withMessage(vm.maxLen('title', 300)),

      body('body')
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
}

const postValidator = new PostValidator();
export default postValidator;
