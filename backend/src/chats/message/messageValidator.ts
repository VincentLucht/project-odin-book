import { body, query } from 'express-validator/lib';

// prettier-ignore
class MessageValidator {
  fetchRules() {
    return [
      query('chat_id')
        .notEmpty()
        .withMessage('Chat ID is required')
        .isString(),
      query('cId')
        .optional()
        .isString(),
    ];
  }

  creationRules() {
    return [
      body('chat_id').trim()
        .isString()
        .notEmpty()
        .withMessage('Chat ID is required'),
      body('content').trim()
        .isString()
        .notEmpty()
        .withMessage('Message content is required'),
    ];
  }

  editRules() {
    return [

    ];
  }

  deleteRules() {
    return [

    ];
  }
}

const messageValidator = new MessageValidator();
export default messageValidator;
