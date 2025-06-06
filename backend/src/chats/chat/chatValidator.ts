import { body, query } from 'express-validator/lib';

// prettier-ignore
class ChatValidator {
  fetchRules() {
    return [
      query('chat_id')
        .notEmpty()
        .withMessage('Chat ID has to be a string')
        .isString(),
    ];
  }

  creationRules() {
    return [
      body('user2_username').trim()
        .isString()
        .notEmpty()
        .withMessage('User 2 username is required'),
    ];
  }

  readRules() {
    return [
      body('chat_id')
        .isString()
        .notEmpty()
        .withMessage('Chat ID is required'),
    ];
  }

  editRules() {
    return [

    ];
  }

  muteRules() {
    return [
      body('chat_id')
        .isString()
        .notEmpty()
        .withMessage('Chat ID is required'),
      body('is_muted')
        .isBoolean()
        .notEmpty()
        .withMessage('is_muted is required'),
    ];
  }

  leaveRules() {
    return [
      body('chat_id')
        .isString()
        .notEmpty()
        .withMessage('Chat ID is required'),
    ];
  }
}

const chatValidator = new ChatValidator();
export default chatValidator;
