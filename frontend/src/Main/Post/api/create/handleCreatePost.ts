import createPost from '@/Main/Post/api/create/createPost';
import catchError from '@/util/catchError';
import { PostType } from '@/Main/CreatePost/CreatePost';
import { NavigateFunction } from 'react-router-dom';

export default function handleCreatePost(
  community_id: string,
  title: string,
  body: string,
  is_spoiler: boolean,
  is_mature: boolean,
  type: PostType,
  token: string,
  flair_id: string,
  navigate?: NavigateFunction,
) {
  createPost(community_id, title, body, is_spoiler, is_mature, type, flair_id, token)
    .then((response) => {
      const { post, communityName } = response;
      navigate && navigate(`/r/${communityName}/${post.id}`);
    })
    .catch((error) => {
      catchError(error);
    });
}
