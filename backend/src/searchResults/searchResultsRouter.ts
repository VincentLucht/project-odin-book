import express from 'express';
import token from '@/auth/token';
import searchResultsValidator from '@/searchResults/searchResultsValidator';
import searchResultsController from '@/searchResults/searchResultsController';

// /search/type?q=query&sbt=searchBy&t=time (cursorId (cId) is optional) (safeSearch is optional)
const searchResultsRouter = express.Router();

searchResultsRouter.get(
  '/posts',
  token.authenticateOptional,
  searchResultsValidator.searchRulesWithSortBy(),
  searchResultsController.searchPosts,
);

searchResultsRouter.get(
  '/communities',
  token.authenticateOptional,
  searchResultsValidator.searchRules(),
  searchResultsController.searchCommunities,
);

searchResultsRouter.get(
  '/comments',
  token.authenticateOptional,
  searchResultsValidator.searchRulesWithSortBy(),
  searchResultsController.searchComments,
);

searchResultsRouter.get(
  '/users',
  token.authenticateOptional,
  searchResultsValidator.searchRules(),
  searchResultsController.searchUsers,
);

export default searchResultsRouter;
