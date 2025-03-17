import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class JoinRequestValidator {
  requestRules() {
    return [
      body('community_id').trim()
      .notEmpty()
      .withMessage(vm.req('Community ID')),
    ];
  }

  deletionRules() {
    return [
      body('community_id').trim()
      .notEmpty()
      .withMessage(vm.req('Community ID')),
    ];
  }
}

const joinRequestValidator = new JoinRequestValidator();
export default joinRequestValidator;
