import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { LevelsModule } from './levels/levels.module';
import { MissionsModule } from './missions/missions.module';
import { QuestionsModule } from './questions/questions.module';
import { ProgressModule } from './progress/progress.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true,
    }),PrismaModule,AuthModule, UsersModule, LevelsModule, MissionsModule, QuestionsModule, ProgressModule, AdminModule, LeaderboardModule, CloudinaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
