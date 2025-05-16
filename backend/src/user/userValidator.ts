import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import { isSortByValidNewAndTop } from '@/util/isSortByValid';

// prettier-ignore
class UserValidator {
  fetchRules() {
    return [
      query('u').trim()
        .notEmpty()
        .withMessage(vm.usernameReq()),

      query('sbt').trim()
        .custom((sort_by) => {
          if (!sort_by) {
            throw new Error('Sort by type is required');
          }

          return isSortByValidNewAndTop(sort_by);
        }),

      query('tf').trim()
        .custom((typeFilter) => {
          if (!typeFilter) {
            throw new Error('Type filter is required');
          }

          if (typeFilter !== 'both' && typeFilter !== 'posts' && typeFilter !== 'comments') {
            throw new Error('Incorrect type filter detected');
          }

          return true;
        }),
    ];
  }

  deletionRules() {
    return [
      body('community_id').trim()
      .notEmpty()
      .withMessage(vm.communityIdReq()),
    ];
  }
}

const userValidator = new UserValidator();
export default userValidator;
