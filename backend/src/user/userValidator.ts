import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import { isSortByValidUser } from '@/util/isSortByValid';

// prettier-ignore
class UserValidator {
  fetchRules() {
    return [
      query('username').trim()
        .notEmpty()
        .withMessage(vm.usernameReq()),

      query('sort_by').trim()
        .custom((sort_by) => {
          if (!sort_by) {
            throw new Error('Sort by is required');
          }

          return isSortByValidUser(sort_by);
        }),

      query('page').trim()
        .notEmpty()
        .withMessage(vm.req('Page')),
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
