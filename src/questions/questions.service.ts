import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const Mission = await this.prisma.mission.findUnique({
      where: { id: createQuestionDto.missionId },
    });

    if (!Mission) {
      throw new NotFoundException('mission Not Found');
    }

    return this.prisma.question.create({
      data: {
        text: createQuestionDto.text,
        order: createQuestionDto.order,
        missionId: createQuestionDto.missionId,

        options: {
          create: createQuestionDto.options,
        },
      },

      include: {
        options: true,
      },
    });
  }

  findByMission(missionId: string) {
    return this.prisma.question.findMany({
      where: {
        missionId,
      },
      include: {
        options: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async submitAnswer(questionId: string, submitAnswerDto: SubmitAnswerDto) {
    const option = await this.prisma.option.findFirst({
      where: {
        id: submitAnswerDto.optionId,
        questionId,
      },
    });
    if (!option) {
      throw new BadRequestException('Invalid option for this question');
    }

    return {
      isCorrect: option.isCorrect,
    };
  }
}
