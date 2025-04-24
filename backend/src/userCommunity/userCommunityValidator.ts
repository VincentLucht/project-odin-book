import { body, query } from 'express-validator';
import vm from '@/util/validationMessage';
import { isSortByValidNewAndTop } from '@/util/isSortByValid';
import isTimeFrameValid from '@/util/isTimeFrameValid';

// prettier-ignore

class UserCommunityValidator {
  fetchHomepageRules() {
    return [
      query('sbt')
        .custom((type) => {
          return isSortByValidNewAndTop(type);
        }),
      query('cId').optional()
        .isString()
        .withMessage('Cursor ID must be a string'),
      query('t')
        .custom((timeframe) => {
          if (!isTimeFrameValid(timeframe)) {
            throw new Error('Invalid timeframe detected');
          }

          return true;
        }),
    ];
  }

  joinRules() {
    return [
      body('community_id').trim()
        .isLength({ min: 1 })
        .withMessage(vm.communityIdReq()),
    ];
  }

  leaveRules() {
    return [
      body('community_id').trim()
        .isLength({ min: 1 })
        .withMessage(vm.communityIdReq()),
    ];
  }
}

const userCommunityValidator = new UserCommunityValidator();
export default userCommunityValidator;
