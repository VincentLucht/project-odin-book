import { body } from 'express-validator/lib';

// prettier-ignore
class ApprovedUserValidator {
  createRules() {
    return [
      body('community_id')
        .notEmpty()
        .isString()
        .withMessage('Chat ID is required'),
      body('approved_username')
        .notEmpty()
        .isString()
        .withMessage('Approved username is required'),
    ];
  }

  deleteRules() {
    return [
      body('community_id')
        .notEmpty()
        .isString()
        .withMessage('Chat ID is required'),
      body('approved_username')
        .notEmpty()
        .isString()
        .withMessage('Approved username is required'),
    ];
  }
}

const approvedUserValidator = new ApprovedUserValidator();
export default approvedUserValidator;
