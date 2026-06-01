import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [users, levels, missions, questions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.level.count(),
      this.prisma.mission.count(),
      this.prisma.question.count(),
    ]);

    return {
      users,
      levels,
      missions,
      questions,
    };
  }
}
