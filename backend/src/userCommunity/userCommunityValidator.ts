import { body } from 'express-validator';
import vm from '@/util/validationMessage';
// prettier-ignore

class UserCommunityValidator {
  joinRules() {
    return [
      body('community_id').trim()
        .isLength({ min: 1 })
        .withMessage(vm.communityIdReq()),
    ];
  }
}

const userCommunityValidator = new UserCommunityValidator();
export default userCommunityValidator;
