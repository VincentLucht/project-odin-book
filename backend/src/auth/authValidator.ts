import { body } from 'express-validator';
import vm from '@/util/validationMessage';
import isValidName from '@/db/managers/util/isValidName';
// prettier-ignore

class AuthValidator {
  signUpRules() {
    return [
      body('username').trim()
        .custom((username) => {
          if (!username) {
            throw new Error('Username is required');
          }
          if (username.length < 2) {
            throw new Error(vm.minLen('Name', 2));
          }
          if (username.length > 20) {
            throw new Error(vm.maxLen('Name', 21));
          }

          if (!isValidName(username)) {
            throw new Error('Username can only contain letters, numbers, and underscores');
          }

          return true;
        }),

      body('email').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('email', 1))
        .isLength({ max: 320 })
        .withMessage(vm.maxLen('email', 320)),

      body('display_name').trim()
        .optional()
        .isLength({ max: 40 })
        .withMessage(vm.maxLen('display Name', 40)),

      body('password').trim()
        .isLength({ min: 1 })
        .withMessage(vm.minLen('password', 1))
        .isLength({ max: 255 })
        .withMessage(vm.maxLen('password', 255)),

      body('confirm_password').trim()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password must match the password.');
          }
          return true;
        }),
    ];
  }

  loginRules() {
    return [
      body('username').trim()
        .notEmpty()
        .withMessage(vm.usernameReq()),

      body('password').trim()
        .notEmpty()
        .withMessage(vm.req('Password')),
    ];
  }
}

const authValidator = new AuthValidator();
export default authValidator;
