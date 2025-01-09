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

      body('is_post_flair_required')
        .isBoolean(),

      body('allow_basic_user_posts')
        .custom((bool, { req }) => {
          const { type } = req.body;
          if (typeof bool !== 'boolean') {
            throw new Error('Invalid value for Allow Basic Users Posts');
          }

          if (type === CommunityType.PUBLIC && !bool) {
            throw new Error('You can only change Allow Basic Users posts if the community is not public');
          }

          return true;
        }),

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
