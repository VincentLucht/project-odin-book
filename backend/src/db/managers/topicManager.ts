import { PrismaClient } from '@prisma/client/default';

export default class TopicManager {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    const topics = await this.prisma.topic.findMany({});
    return topics.map((topic) => topic.id);
  }

  async getAllMainAndSubTopics() {
    const topics = await this.prisma.mainTopic.findMany({
      include: {
        topics: true,
      },
    });

    return topics;
  }
}
