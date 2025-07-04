import PostLazy from '@/Main/Post/components/Loading/PostLazy';
import CommentOverviewLazy from '@/Main/CommentOverview/CommentOverviewLazy';

interface PostsAndCommentsLoadingProps {
  amount: number;
}

export default function PostsAndCommentsLoading({
  amount,
}: PostsAndCommentsLoadingProps) {
  const generateRandomContent = () => {
    const content = [];
    for (let i = 0; i < amount; i++) {
      const type = Math.random() > 0.5 ? 'post' : 'comment';
      content.push({ type, key: `${type}-${i}` });
    }
    return content.sort(() => Math.random() - 0.5);
  };

  const mixedContent = generateRandomContent();

  return (
    <>
      {mixedContent.map((item) =>
        item.type === 'post' ? (
          <PostLazy key={item.key} mode="overview" />
        ) : (
          <CommentOverviewLazy key={item.key} />
        ),
      )}
    </>
  );
}
