import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class ReportValidator {
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

  replyToMessageRules() {
    return [
      body('type')
        .custom((type) => {
          if (type !== 'POST' && type !== 'Comment') {
            throw new Error('Incorrect type detected');
          }

          return true;
        }),

      body('item_id').trim()
        .notEmpty()
        .withMessage('Item ID is required'),

      body('subject').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Subject', 1))
        .isLength({ max: 20 })
        .withMessage(vm.maxLen('Subject', 214)),

      body('reason').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('Reason', 1))
        .isLength({ max: 500 })
        .withMessage(vm.maxLen('Reason', 500)),
    ];
  }
}

const reportValidator = new ReportValidator();
export default reportValidator;
