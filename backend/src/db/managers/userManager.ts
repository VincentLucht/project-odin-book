import { PrismaClient } from '@prisma/client/default';

export default class UserManager {
  constructor(private prisma: PrismaClient) {}

  // ! READ
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async getUserByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  // ! CREATE
  async createUser(
    username: string,
    email: string,
    hashedPassword: string,
    display_name?: string,
    profile_picture_url?: string,
  ) {
    await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        display_name,
        profile_picture_url,
      },
    });
  }
}
