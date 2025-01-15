import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isVoteTypeValid from '@/postVote/util/isVoteTypeValid';

// prettier-ignore
class CommentVoteValidator {
  creationRules() {
    return [
      body('comment_id').trim()
      .notEmpty()
      .withMessage(vm.req('Comment ID')),

      body('vote_type')
        .custom((postVote: string) => {
          return isVoteTypeValid(postVote);
        }),
    ];
  }
}

const commentVoteValidator = new CommentVoteValidator();
export default commentVoteValidator;
