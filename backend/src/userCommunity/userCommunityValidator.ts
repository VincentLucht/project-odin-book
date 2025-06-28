import { body, query } from 'express-validator';
import vm from '@/util/validationMessage';
import { isSortByValidNewAndTop } from '@/util/isSortByValid';
import isTimeFrameValid from '@/util/isTimeFrameValid';

// prettier-ignore

class UserCommunityValidator {
  getMembersRules() {
    return [
      query('cmId').trim()
        .isString()
        .notEmpty()
        .withMessage('Community ID is required'),
      query('cId')
        .isString()
        .optional(),
      query('m').trim()
        .custom((mode) => {
          if (!mode) {
            throw new Error('Mode is required');
          }

          if (!['users', 'moderators', 'banned', 'approved'].includes(mode)) {
            throw new Error('Invalid mode detected');
          }

          return true;
        }),
    ];
  }

  getMembersByNameRules() {
    return [
      query('cmId').trim()
        .isString()
        .notEmpty()
        .withMessage('Community ID is required'),
      query('u').trim()
        .isString()
        .notEmpty()
        .withMessage('Username is required'),
      query('m').trim()
        .custom((mode) => {
          if (!mode) {
            throw new Error('Mode is required');
          }

          if (!['users', 'moderators', 'banned', 'approved', 'all'].includes(mode)) {
            throw new Error('Invalid mode detected');
          }

          return true;
        }),
      query('t')
        .optional()
        .trim()
        .isInt()
        .toInt(),
    ];
  }

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

  banRules() {
    return [
      body('community_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Community ID is required'),
      body('username').trim()
        .isString()
        .notEmpty()
        .withMessage('Username is required'),
      body('ban_duration')
        .custom((value) => {
          if (value === null) {
            return true;
          }
          if (value === undefined || value === '') {
            throw new Error('Ban duration is required');
          }

          const banDate = new Date(value);
          if (isNaN(banDate.getTime())) {
            throw new Error('Ban duration must be a valid date');
          }

          // Check if date is in future
          if (banDate <= new Date()) {
            throw new Error('Ban duration must be in the future');
          }

          return true;
        }),
      body('ban_reason').trim()
        .isString()
        .isLength({ max: 500, min: 1 })
        .withMessage('Ban reason is required and has to be between 1-500 characters'),
    ];
  }

  unbanRules() {
    return [
      body('community_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Community ID is required'),
      body('username').trim()
        .isString()
        .notEmpty()
        .withMessage('Username is required'),
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
