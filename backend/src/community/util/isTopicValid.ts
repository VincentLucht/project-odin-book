import db from '@/db/db';

export default async function isTopicValid(userTopics: string[]) {
  if (!userTopics || !Array.isArray(userTopics)) {
    throw new Error('Community Topics are required');
  }

  const topics = await db.topic.getAll();
  const topicSet = new Set(topics);

  userTopics.forEach((userTopic) => {
    if (!topicSet.has(userTopic)) {
      throw new Error(`Invalid topic detected: ${userTopic}`);
    }
  });
}
