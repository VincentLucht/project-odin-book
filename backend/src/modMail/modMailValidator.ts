import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class ModMailValidator {
  fetchRules() {
    return [
      query('cn').trim()
        .notEmpty()
        .withMessage(vm.req('Community Name')),
      query('cId').optional()
        .isString()
        .withMessage('Community ID must be a string'),
    ];
  }

  sendMessageRules() {
    return [
      body('subject').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Subject', 1))
        .isLength({ max: 200 })
        .withMessage(vm.maxLen('Subject', 200)),

      body('message').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Message', 1))
        .isLength({ max: 1000 })
        .withMessage(vm.maxLen('Message', 1000)),

      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),
    ];
  }

  replyToMessageRules() {
    return [
      body('subject').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Subject', 1))
        .isLength({ max: 214 })
        .withMessage(vm.maxLen('Subject', 214)),

      body('message').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Message', 1))
        .isLength({ max: 1000 })
        .withMessage(vm.maxLen('Message', 1000)),

      body('modmail_id').trim()
        .notEmpty()
        .withMessage('Mod mail is required'),
    ];
  }

  updateMessageRules() {
    return [
      body('modmail_id').trim()
        .notEmpty()
        .withMessage('Mod mail is required'),
      body('archived').trim()
        .optional()
        .isBoolean()
        .toBoolean(),
      body('replied').trim()
        .optional()
        .isBoolean()
        .toBoolean(),
    ];
  }
}

const modMailValidator = new ModMailValidator();
export default modMailValidator;
