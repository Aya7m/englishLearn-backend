import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/constants';

@Module({
  imports: [
  PrismaModule,
  JwtModule.register({
     secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  }),
],
  controllers: [ProgressController],
  providers: [ProgressService]
})
export class ProgressModule {}
