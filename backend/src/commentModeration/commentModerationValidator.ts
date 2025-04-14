import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isModerationTypeValid from '@/util/isModerationTypeValid';

// prettier-ignore
class CommentModerationValidator {
  moderationRules() {
    return [
      body('comment_id').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),

      body('moderation_action')
        .custom((action) => {
          if (!action) {
            throw new Error('Moderation action is required');
          }

          if (!isModerationTypeValid(action)) {
            throw new Error('Invalid moderation type detected');
          }

          return true;
        }),

      body('reason')
        .custom((reason: string) => {
          if (reason && reason.length > 20) {
            throw new Error('Reason length must be under 20 characters');
          }

          return true;
        }),
    ];
  }
}

const commentModerationValidator = new CommentModerationValidator();
export default commentModerationValidator;
