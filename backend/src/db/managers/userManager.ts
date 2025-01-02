import { PrismaClient } from '@prisma/client/default';

export default class UserManager {
  constructor(private prisma: PrismaClient) {}

  // ! READ
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  // ! CREATE
  async create(
    username: string,
    email: string,
    hashedPassword: string,
    display_name?: string,
    profile_picture_url?: string,
    cake_day?: string,
  ) {
    await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        display_name,
        profile_picture_url,
        cake_day,
      },
    });
  }
}
