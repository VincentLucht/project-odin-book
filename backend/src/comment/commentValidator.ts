import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class CommentValidator {
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
}

const commentValidator = new CommentValidator();
export default commentValidator;
