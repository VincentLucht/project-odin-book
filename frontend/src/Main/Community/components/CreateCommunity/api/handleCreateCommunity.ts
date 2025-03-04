import createCommunity from '@/Main/Community/components/CreateCommunity/api/createCommunity';
import catchError from '@/util/catchError';
import { CommunityTypes, DBTopic } from '@/interface/dbSchema';

export default function handleCreateCommunity(
  name: string,
  description: string,
  is_mature: boolean,
  allow_basic_user_posts: boolean,
  is_post_flair_required: boolean,
  type: CommunityTypes,
  topics: DBTopic[],
  banner_url_desktop: string | null,
  banner_url_mobile: string | null,
  profile_picture_url: string | null,
  token: string,
) {
  const convertedTopics: string[] = [];
  topics.forEach((topic) => {
    convertedTopics.push(topic.id);
  });

  createCommunity(
    name,
    description,
    is_mature,
    allow_basic_user_posts,
    is_post_flair_required,
    type,
    convertedTopics,
    banner_url_desktop,
    banner_url_mobile,
    profile_picture_url,
    token,
  )
    .then(() => {
      console.log('Created Community');
    })
    .catch((error) => {
      console.log(error);
      catchError(error);
    });
}
