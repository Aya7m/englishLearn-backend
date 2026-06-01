import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMissionDto: CreateMissionDto) {
    const level = await this.prisma.level.findUnique({
      where: { id: createMissionDto.levelId },
    });

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    return this.prisma.mission.create({
      data: createMissionDto,
    });
  }

  findAll() {
    return this.prisma.mission.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        level: true,
      },
    });
  }

  findByLevel(levelId: string) {
    return this.prisma.mission.findMany({
      where: { levelId },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id },
      include: {
        level: true,
      },
    });

    if (!mission) {
      throw new NotFoundException('Mission not found');
    }

    return mission;
  }

  async remove(id: string) {
    await this.prisma.mission.findUniqueOrThrow({
      where: { id },
    });

    return this.prisma.$transaction(async (tx) => {
      const questions = await tx.question.findMany({
        where: { missionId: id },
        select: { id: true },
      });

      const questionIds = questions.map((question) => question.id);

      await tx.option.deleteMany({
        where: {
          questionId: {
            in: questionIds,
          },
        },
      });

      await tx.question.deleteMany({
        where: {
          missionId: id,
        },
      });

      await tx.userProgress.deleteMany({
        where: {
          missionId: id,
        },
      });

      return tx.mission.delete({
        where: { id },
      });
    });
  }
}
