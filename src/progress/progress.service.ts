import { CompleteMissionDto } from './dto/complete-mission.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private isSameDay(date1: Date, date2: Date) {
    return date1.toDateString() === date2.toDateString();
  }

  private isYesterday(date: Date, today: Date) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return date.toDateString() === yesterday.toDateString();
  }

  private async awardBadge(userId: string, badgeName: string) {
    const badge = await this.prisma.badge.findUnique({
      where: { name: badgeName },
    });

    if (!badge) return null;

    const existingUserBadge = await this.prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });

    if (existingUserBadge) return null;

    await this.prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });

    return badge;
  }

  private async checkAndAwardBadges(userId: string) {
    const earnedBadges: {
      id: string;
      name: string;
      description: string;
      icon: string;
      createdAt: Date;
    }[] = [];

    const completedMissionsCount = await this.prisma.userProgress.count({
      where: {
        userId,
        isCompleted: true,
      },
    });

    if (completedMissionsCount >= 1) {
      const badge = await this.awardBadge(userId, 'First Mission Completed');
      if (badge) earnedBadges.push(badge);
    }

    const userProgress = await this.prisma.userProgress.findMany({
      where: {
        userId,
        isCompleted: true,
      },
    });

    const totalXp = userProgress.reduce((sum, item) => {
      return sum + item.xpEarned;
    }, 0);

    if (totalXp >= 100) {
      const badge = await this.awardBadge(userId, '100 XP Earned');
      if (badge) earnedBadges.push(badge);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = await this.prisma.userProgress.count({
      where: {
        userId,
        isCompleted: true,
        updatedAt: {
          gte: today,
        },
      },
    });

    if (completedToday >= 3) {
      const badge = await this.awardBadge(userId, 'Daily Goal Completed');

      if (badge) {
        earnedBadges.push(badge);
      }
    }

    const a1Level = await this.prisma.level.findUnique({
      where: { code: 'A1' },
      include: { missions: true },
    });

    if (a1Level) {
      const completedA1Missions = await this.prisma.userProgress.count({
        where: {
          userId,
          isCompleted: true,
          mission: {
            levelId: a1Level.id,
          },
        },
      });

      if (
        a1Level.missions.length > 0 &&
        completedA1Missions === a1Level.missions.length
      ) {
        const badge = await this.awardBadge(userId, 'A1 Master');
        if (badge) earnedBadges.push(badge);
      }
    }

    return earnedBadges;
  }

  async completeMission(
    userId: string,
    missionId: string,
    completeMission: CompleteMissionDto,
  ) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const today = new Date();

    let currentStreak = user.currentStreak;
    let longestStreak = user.longestStreak;

    if (!user.lastActiveAt) {
      currentStreak = 1;
    } else if (this.isSameDay(user.lastActiveAt, today)) {
      currentStreak = user.currentStreak;
    } else if (this.isYesterday(user.lastActiveAt, today)) {
      currentStreak = user.currentStreak + 1;
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak,
        longestStreak,
        lastActiveAt: today,
      },
    });

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_missionId: {
          userId,
          missionId,
        },
      },
      update: {
        isCompleted: true,
        score: completeMission.score,
        xpEarned: mission.xpReward,
      },
      create: {
        userId,
        missionId,
        isCompleted: true,
        score: completeMission.score,
        xpEarned: mission.xpReward,
      },
    });

    const earnedBadges = await this.checkAndAwardBadges(userId);

    return {
      progress,
      earnedBadges,
    };
  }

  async getMyProgress(userId: string) {
    return this.prisma.userProgress.findMany({
      where: { userId },
      include: {
        mission: {
          include: {
            level: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getMyStats(userId: string) {
    const progress = await this.prisma.userProgress.findMany({
      where: {
        userId,
        isCompleted: true,
      },
    });

    const totalXp = progress.reduce((sum, item) => {
      return sum + item.xpEarned;
    }, 0);

    const completedMissions = progress.length;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true,
        longestStreak: true,
      },
    });

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const completedToday = await this.prisma.userProgress.count({
      where: {
        userId,
        isCompleted: true,
        updatedAt: {
          gte: today,
        },
      },
    });

    return {
      totalXp,
      completedMissions,
      currentStreak: user?.currentStreak ?? 0,
      longestStreak: user?.longestStreak ?? 0,
      completedToday,
    };
  }

  async getLevelsProgress(userId: string) {
    const levels = await this.prisma.level.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        missions: {
          include: {
            progress: {
              where: {
                userId,
                isCompleted: true,
              },
            },
          },
        },
      },
    });

    const levelsWithProgress = levels.map((level) => {
      const totalMissions = level.missions.length;

      const completedMissions = level.missions.filter((mission) => {
        return mission.progress.length > 0;
      }).length;

      const progressPercentage =
        totalMissions === 0
          ? 0
          : Math.round((completedMissions / totalMissions) * 100);

      return {
        id: level.id,
        title: level.title,
        code: level.code,
        description: level.description,
        order: level.order,
        totalMissions,
        completedMissions,
        progressPercentage,
      };
    });

    return levelsWithProgress.map((level, index) => {
      const previousLevel = levelsWithProgress[index - 1];

      const isUnlocked =
        index === 0 ? true : (previousLevel?.progressPercentage ?? 0) >= 80;

      return {
        ...level,
        isUnlocked,
      };
    });
  }

  async getLevelProgress(userId: string, levelId: string) {
    const levelsProgress = await this.getLevelsProgress(userId);

    const currentLevel = levelsProgress.find((level) => {
      return level.id === levelId;
    });

    if (!currentLevel) {
      throw new NotFoundException('Level not found');
    }

    if (!currentLevel.isUnlocked) {
      throw new ForbiddenException('Level is locked');
    }

    const missions = await this.prisma.mission.findMany({
      where: { levelId },
      include: {
        progress: {
          where: { userId },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    const missionsWithProgress = missions.map((mission) => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      xpReward: mission.xpReward,
      order: mission.order,
      isCompleted: mission.progress.some((progress) => progress.isCompleted),
    }));

    return missionsWithProgress.map((mission, index) => {
      const previousMission = missionsWithProgress[index - 1];

      const isUnlocked =
        index === 0 ? true : previousMission?.isCompleted === true;

      return {
        ...mission,
        isUnlocked,
      };
    });
  }
}
