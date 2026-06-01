import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/constants';

@Module({
  imports:[PrismaModule, JwtModule.register({
       secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),],
  controllers: [QuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}
