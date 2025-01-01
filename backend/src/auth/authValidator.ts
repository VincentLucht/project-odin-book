import { body } from 'express-validator';
import vm from '@/util/validationMessage';
// prettier-ignore

class AuthValidator {
  signUpRules() {
    return [
      body('username').trim()
        .isLength({ min: 2 })
        .withMessage(vm.minLen('username', 2))
        .isLength({ max: 20 })
        .withMessage(vm.maxLen('username', 20)),

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
