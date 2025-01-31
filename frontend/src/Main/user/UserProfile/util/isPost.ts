import { DBPost, DBComment } from '@/interface/dbSchema';

export default function isPost(input: DBPost | DBComment) {
  return 'poster_id' in input;
}
