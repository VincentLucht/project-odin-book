import { PrismaClient } from '@prisma/client/default';

export default async function createSavedPostsAndComments(
  prisma: PrismaClient,
) {
  const allPosts = await prisma.post.findMany();
  await prisma.savedPost.createMany({
    data: allPosts.map((post) => ({
      post_id: post.id,
      user_id: '1',
    })),
  });

  const allComments = await prisma.comment.findMany();
  await prisma.savedComment.createMany({
    data: allComments.map((comment) => ({
      comment_id: comment.id,
      user_id: '1',
    })),
  });

  console.log('Saved all posts and comments');
}
