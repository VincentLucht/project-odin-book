import { UrlItems } from '@/components/Interaction/Share';
import slugify from 'slugify';

export default function getCommentThreadUrl(
  urlItems: UrlItems,
  commentId: string,
  mode: 'absoluteUrl' | 'relativeUrl' = 'absoluteUrl',
) {
  const slug = slugify(urlItems.postName, { lower: true });
  const slugPart = slug ? `/${slug}` : '';

  if (mode === 'absoluteUrl') {
    return `${window.location.origin}/r/${urlItems.communityName}/${urlItems.postId}${slugPart}/${commentId}`;
  } else {
    return `/r/${urlItems.communityName}/${urlItems.postId}${slugPart}/${commentId}`;
  }
}
