import { PrismaClient } from '@prisma/client/default';
export default class ChatAdminManager {
  constructor(private prisma: PrismaClient) {}
}
