import CommunityFlairTag from '@/Main/Global/CommunityFlairTag';

import { PostAssignedFlair } from '@/interface/dbSchema';

interface PostFlairTagProps {
  showFlair: boolean;
  postAssignedFlair: PostAssignedFlair;
  className?: string;
}

export default function PostFlairTag({
  showFlair,
  postAssignedFlair,
  className,
}: PostFlairTagProps) {
  if (!postAssignedFlair?.length && showFlair) {
    return null;
  }

  const flair = postAssignedFlair[0].community_flair;

  return <CommunityFlairTag flair={{ ...flair }} className={className} />;
}
