import { CommunityType } from '@prisma/client/default';
import { body, param, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isTopicValid from '@/community/util/isTopicValid';
import isSortByValid from '@/util/isSortByValid';

// prettier-ignore
class CommunityValidator {
  fetchRules() {
    return [
      param('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('community name')),

      param('sort_by_type').trim()
        .custom((type: string) => {
          return isSortByValid(type);
        }),
    ];
  }

  searchByNameRules() {
    return [
      param('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('name')),
  ];
  }

  getCreationInfoRules() {
    return [
      param('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('name')),
      query('get_membership')
        .optional()
        .isBoolean(),
    ];
  }

  isNameAvailableRules() {
    return [
      query('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('Community Name')),
    ];
  }

  creationRules() {
    return [
      body('name').trim()
        .isLength({ min: 3 })
        .withMessage(vm.minLen('Name', 3))
        .isLength({ max: 21 })
        .withMessage(vm.maxLen('Name', 21)),

      body('description').trim()
        .notEmpty()
        .withMessage(vm.req('Description'))
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
