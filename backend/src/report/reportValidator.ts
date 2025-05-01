import { body, query } from 'express-validator/lib';
import vm from '@/util/validationMessage';

// prettier-ignore
class ReportValidator {
  fetchRules() {
    return [
      query('cn').trim()
        .notEmpty()
        .withMessage(vm.req('Community Name')),
      query('sbt')
        .custom((type) => {
          if (type !== 'new' && type !== 'top') {
            throw new Error('Invalid type detected');
          }

          return true;
        }),
      query('t')
        .custom((type) => {
          if (type !== 'all' && type !== 'posts' && type !== 'comments') {
            throw new Error('Invalid type detected');
          }

          return true;
        }),
      query('s')
        .custom((filter) => {
          if (filter !== 'pending' && filter !== 'moderated' && filter !== 'approved' && filter !== 'dismissed') {
            throw new Error('Invalid filter detected');
          }

          return true;
        }),
      query('ls').optional()
        .isString()
        .withMessage('Last score must be a string'),
      query('ld').optional()
        .isString()
        .withMessage('Last date must be a string'),
      query('cId').optional()
        .isString()
        .withMessage('Cursor ID must be a string'),
    ];
  }

  replyToMessageRules() {
    return [
      body('type')
        .custom((type) => {
          if (type !== 'POST' && type !== 'COMMENT') {
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
