import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Aya Ahmed' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}