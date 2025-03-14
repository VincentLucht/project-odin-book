import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isValidHex from '@/communityFlair/util/isValidHex';

// prettier-ignore
class CommunityFlairValidator {
  getAllCommunityFlairsRules() {
    return [
      query('community_id')
        .notEmpty()
        .withMessage('Community Id is required'),
    ];
  }

  getAllPostFlairsRules() {
    return [
      query('community_id')
        .notEmpty()
        .withMessage('Community Id is required'),
    ];
  }

  creationRules() {
    return [
      body('name').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('name', 1))
        .isLength({ max: 20 })
        .withMessage(vm.maxLen('name', 20)),

      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('textColor').trim()
        .notEmpty()
        .withMessage(vm.req('textColor'))
        .isLength({ max: 7 })
        .withMessage(vm.maxLen('textColor', 7))
        .custom((color) => {
          return isValidHex(color);
        }),

      body('color').trim()
        .notEmpty()
        .withMessage(vm.req('color'))
        .isLength({ max: 7 })
        .withMessage(vm.maxLen('color', 7))
        .custom((color) => {
          return isValidHex(color);
        }),

      body('is_assignable_to_posts')
        .isBoolean(),

      body('is_assignable_to_users')
        .isBoolean(),

      body('emoji').trim()
        .isLength({ max: 1 })
        .withMessage(vm.maxLen('emoji', 1)),
    ];
  }
}

const communityFlairValidator = new CommunityFlairValidator();
export default communityFlairValidator;
