import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class UserAssignedFlairValidator {
  assignRules() {
    return [
      body('community_id').trim()
      .notEmpty()
      .withMessage(vm.communityIdReq()),

      body('community_flair_id').trim()
        .notEmpty()
        .withMessage(vm.req('Community flair ID')),
    ];
  }

  deletionRules() {
    return [
      body('community_id').trim()
      .notEmpty()
      .withMessage(vm.communityIdReq()),

      body('user_assigned_flair_id').trim()
        .notEmpty()
        .withMessage(vm.req('User assigned flair ID')),
    ];
  }
}

const userAssignedFlairValidator = new UserAssignedFlairValidator();
export default userAssignedFlairValidator;
