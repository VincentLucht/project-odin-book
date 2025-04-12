import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isModerationTypeValid from '@/util/isModerationTypeValid';

// prettier-ignore
class PostModerationValidator {
  moderationRules() {
    return [
      body('post_id').trim()
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

  updatePostAsModeratorRules() {
    return [
      body('post_id').trim()
        .notEmpty()
        .withMessage(vm.postIdReq()),
    ];
  }

  deleteModRules() {
    return [
      body('community_id').trim()
        .notEmpty()
        .withMessage(vm.communityIdReq()),

      body('target_user_id').trim()
        .notEmpty()
        .withMessage(vm.req('Target user id required')),
    ];
  }
}

const postModerationValidator = new PostModerationValidator();
export default postModerationValidator;
