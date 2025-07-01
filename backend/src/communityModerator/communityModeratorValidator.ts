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

      body('username').trim()
        .notEmpty()
        .withMessage(vm.req('Username')),
    ];
  }

  deleteModRules() {
    return [
      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('username').trim()
        .notEmpty()
        .withMessage(vm.req('Username')),
    ];
  }

  leaveModRules() {
    return [
      body('community_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Community ID is required'),
    ];
  }
}

const communityModeratorValidator = new CommunityModeratorValidator();
export default communityModeratorValidator;
