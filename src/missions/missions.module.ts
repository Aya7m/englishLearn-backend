import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/auth/constants';

@Module({
  imports: [PrismaModule,JwtModule.register({
       secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),],
  controllers: [MissionsController],
  providers: [MissionsService]
})
export class MissionsModule {}
