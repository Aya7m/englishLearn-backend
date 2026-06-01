import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        progress: {
          where: {
            isCompleted: true,
          },
          select: {
            xpEarned: true,
          },
        },
      },
    });

    return users
      .map((user) => {
        const totalXp = user.progress.reduce((sum, item) => {
          return sum + item.xpEarned;
        }, 0);
        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          totalXp,
          completedMission: user.progress.length,
        };
      })
      .sort((a, b) => b.totalXp - a.totalXp);
  }
}
