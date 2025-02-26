import API_URL from '@/auth/ApiUrl';
import { PostType } from '@/Main/CreatePost/CreatePost';
import { DBPost } from '@/interface/dbSchema';

interface CreatePostResponse {
  message: string;
  error?: string;
  post: DBPost;
  communityName: string;
}

export default async function createPost(
  community_id: string,
  title: string,
  body: string,
  is_spoiler: boolean,
  is_mature: boolean,
  type: PostType,
  token: string,
) {
  const response = await fetch(`${API_URL}/post`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      community_id,
      title,
      body,
      is_spoiler,
      is_mature,
      type,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as CreatePostResponse;
  return result;
}
