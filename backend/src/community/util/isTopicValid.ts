import db from '@/db/db';

// Format is ["topic ID"]
export default async function isTopicValid(userTopics: string[]) {
  if (!userTopics || !Array.isArray(userTopics)) {
    throw new Error('Community Topics are required');
  }
  if (userTopics.length > 3) {
    throw new Error('You can only choose 3 community topics');
  }

  const topics = await db.topic.getAll();
  const topicSet = new Set(topics);

  userTopics.forEach((userTopic) => {
    if (!topicSet.has(userTopic)) {
      throw new Error(`Invalid topic detected: ${userTopic}`);
    }
  });
}
