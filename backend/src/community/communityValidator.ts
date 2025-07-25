import { CommunityType } from '@prisma/client/default';
import { body, param, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isTopicValid from '@/community/util/isTopicValid';
import isSortByValid from '@/util/isSortByValid';
import isValidName from '@/db/managers/util/isValidName';
import isCommunityTypeValid from '@/community/util/isCommunityTypeValid';

// prettier-ignore
class CommunityValidator {
  fetchRules() {
    return [
      query('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('Community name')),
    ];
  }

  fetchRulesSortBy() {
    return [
      param('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('Community name')),

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
        .withMessage(vm.req('Community name')),
  ];
  }

  getCreationInfoRules() {
    return [
      param('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('Name')),
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
      body('name')
        .custom((name) => {
          if (!name) {
            throw new Error('Name is required');
          }
          if (name.length < 3) {
            throw new Error(vm.minLen('Name', 3));
          }
          if (name.length > 21) {
            throw new Error(vm.maxLen('Name', 21));
          }

          if (!isValidName(name)) {
            throw new Error('Name can only contain letters, numbers, and underscores');
          }

          return true;
        }),

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
          return isCommunityTypeValid(input);
        }),

      body('topics').trim()
        .custom((topics) => {
          return isTopicValid(topics);
        }),
    ];
  }

  // MODERATION
  editCommunitySettingsRules() {
    return [
      body('community_name').trim()
        .notEmpty()
        .withMessage(vm.req('Community name')),
    ];
  }
}

const communityValidator = new CommunityValidator();
export default communityValidator;
