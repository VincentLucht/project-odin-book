import { query } from 'express-validator/lib';
import vm from '@/util/validationMessage';
import { isSortByValidSearch } from '@/util/isSortByValid';

// prettier-ignore
class SearchResultsValidator {
  searchRules() {
    return [
      query('q').trim()
        .notEmpty()
        .withMessage(vm.req('Query')),
      ];
  }

  searchRulesWithSortBy() {
    return [
      query('q').trim()
        .notEmpty()
        .withMessage(vm.req('Query')),

      query('sbt').trim()
        .custom((type: string) => {
          return isSortByValidSearch(type);
        }),
    ];
  }
}

const searchResultsValidator = new SearchResultsValidator();
export default searchResultsValidator;
