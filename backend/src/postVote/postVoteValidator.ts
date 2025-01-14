import { body } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import isVoteTypeValid from '@/postVote/util/isVoteTypeValid';

// prettier-ignore
class PostVoteValidator {
  voteRules() {
    return [
      body('post_id').trim()
        .notEmpty()
        .withMessage(vm.req('Post ID')),

      body('vote_type')
        .custom((postVote: string) => {
          return isVoteTypeValid(postVote);
        }),
    ];
  }

  deletionRules() {
    return [
      body('post_id').trim()
        .notEmpty()
        .withMessage(vm.req('Post ID')),
    ];
  }
}

const postVoteValidator = new PostVoteValidator();
export default postVoteValidator;
