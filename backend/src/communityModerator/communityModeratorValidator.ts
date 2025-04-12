import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class CommunityModeratorValidator {
  makeModRules() {
    return [
      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('target_user_id').trim()
        .notEmpty()
        .withMessage(vm.req('Target user id required')),
    ];
  }

  deleteModRules() {
    return [
      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('target_user_id').trim()
        .notEmpty()
        .withMessage(vm.req('Target user id required')),
    ];
  }
}

const communityModeratorValidator = new CommunityModeratorValidator();
export default communityModeratorValidator;
