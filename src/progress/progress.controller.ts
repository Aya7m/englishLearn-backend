import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';

import { CompleteMissionDto } from './dto/complete-mission.dto';
import type { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { currentUser } from 'src/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtGuard)
export class ProgressController {
  constructor(private readonly ProgressService: ProgressService) {}

  @Post('missions/:missionId/complete')
  completeMission(
    @currentUser() user: JwtPayload,
    @Param('missionId') missionId: string,
    @Body() completeMissionDto: CompleteMissionDto,
  ) {
    return this.ProgressService.completeMission(
      user.sub,
      missionId,
      completeMissionDto,
    );
  }

  @Get('me')
  getMyProgress(@currentUser() user: JwtPayload) {
    return this.ProgressService.getMyProgress(user.sub);
  }

  @Get('state')
  getMyStats(@currentUser() user: JwtPayload) {
    return this.ProgressService.getMyStats(user.sub);
  }

  @Get('levels')
  getLevelsProgress(@currentUser() user: JwtPayload) {
    return this.ProgressService.getLevelsProgress(user.sub);
  }

  @Get('/level/:levelId')
  getLevelProgress(
    @currentUser() user: JwtPayload,
    @Param('levelId') levelId: string,
  ) {
    return this.ProgressService.getLevelProgress(user.sub, levelId);
  }
}
