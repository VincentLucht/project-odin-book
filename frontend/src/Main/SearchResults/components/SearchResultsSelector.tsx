import Selector from '@/components/Selector/Selector';
import SelectorButton from '@/components/Selector/SelectorButton';

import { QueryType } from '@/Main/SearchResults/SearchResults';

interface SearchResultsSelectorProps {
  queryType: QueryType;
  setQueryType: React.Dispatch<React.SetStateAction<QueryType>>;
}

export default function SearchResultsSelector({
  queryType,
  setQueryType,
}: SearchResultsSelectorProps) {
  const onSelectQueryType = (queryType: QueryType) => setQueryType(queryType);

  return (
    <Selector className="h-14 text-[15px]">
      <SelectorButton
        name="Posts"
        isActive={queryType === 'posts'}
        onClick={() => onSelectQueryType('posts')}
      />

      <SelectorButton
        name="Communities"
        isActive={queryType === 'communities'}
        onClick={() => onSelectQueryType('communities')}
      />

      <SelectorButton
        name="Comments"
        isActive={queryType === 'comments'}
        onClick={() => onSelectQueryType('comments')}
      />
      <SelectorButton
        name="People"
        isActive={queryType === 'people'}
        onClick={() => onSelectQueryType('people')}
      />
    </Selector>
  );
}
