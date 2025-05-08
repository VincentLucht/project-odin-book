import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isValidHex from '@/communityFlair/util/isValidHex';

// prettier-ignore
class NotificationValidator {
  fetchByRules() {
    return [
      query('sbt')
        .custom((sortByType) => {
          if (sortByType !== 'all' && sortByType !== 'read' && sortByType !== 'unread') {
            throw new Error('Invalid sort by type detected');
          }

            return true;
        }),

      query('cId').optional()
        .isString()
        .withMessage('Cursor ID must be a string'),
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

  updateRules() {
    return [
      body('community_flair_id').trim()
        .notEmpty()
        .withMessage('Community Flair ID is required'),

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

  readRules() {
    return [
      body('notification_id').trim()
        .notEmpty()
        .withMessage('Notification ID is required'),
    ];
  }

  hideRules() {
    return [
      body('notification_id').trim()
        .notEmpty()
        .withMessage('Notification ID is required'),
    ];
  }

  deletionRules() {
    return [
      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.req('Community ID')),
      body('community_flair_id').trim()
        .notEmpty()
        .withMessage('Community flair ID is required'),
    ];
  }
}

const notificationValidator = new NotificationValidator();
export default notificationValidator;
