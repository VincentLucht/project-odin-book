import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class PostAssignedFlairValidator {
  assignRules() {
    return [
      body('post_id').trim()
      .notEmpty()
      .withMessage(vm.req('Post ID')),

      body('community_flair_id').trim()
        .notEmpty()
        .withMessage(vm.req('Community flair ID')),
    ];
  }

  deletionRules() {
    return [
      body('post_id').trim()
      .notEmpty()
      .withMessage(vm.req('Post ID')),

      body('community_flair_id').trim()
        .notEmpty()
        .withMessage(vm.req('Community flair ID')),
    ];
  }
}

const postAssignedFlairValidator = new PostAssignedFlairValidator();
export default postAssignedFlairValidator;
