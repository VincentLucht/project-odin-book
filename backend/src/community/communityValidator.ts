import { CommunityType } from '@prisma/client/default';
import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isTopicValid from '@/community/util/isTopicValid';

// prettier-ignore
class CommunityValidator {
  creationRules() {
    return [
      body('name').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Name', 1))
        .isLength({ max: 30 })
        .withMessage(vm.maxLen('Name', 30)),

      body('description').trim()
        .isLength({ max: 300 })
        .withMessage(vm.maxLen('Description', 300)),

      body('is_mature')
        .isBoolean(),

      body('type').trim()
        .custom((input) => {
          let found = false;
          for (const key in CommunityType) {
            if (CommunityType[key as keyof typeof CommunityType] === input) {
              found = true;
              break;
            }
          }

          if (found) {
            return true;
          }
        }),

      body('topics').trim()
        .custom((topics) => {
          return isTopicValid(topics);
        }),
    ];
  }
}

const communityValidator = new CommunityValidator();
export default communityValidator;
