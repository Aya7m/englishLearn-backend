import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createQuestion: CreateQuestionDto) {
    return this.questionsService.create(createQuestion);
  }

  @Get('mission/:missionId')
  findByMission(@Param('missionId') missionId: string) {
    return this.questionsService.findByMission(missionId);
  }

  @Post(':questionId/answer')
  @UseGuards(JwtGuard)
  submitAnswer(
    @Param('questionId') questionId: string,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ) {
    return this.questionsService.submitAnswer(questionId, submitAnswerDto);
  }
}
