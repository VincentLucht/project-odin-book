import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class CommunityModeratorValidator {
  fetchRules() {
    return [
      query('cmId').trim()
        .isString()
        .notEmpty()
        .withMessage('Community ID is required'),
      query('cId').trim()
        .optional()
        .isString(),
    ];
  }

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
