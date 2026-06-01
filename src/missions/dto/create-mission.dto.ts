import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMissionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  xpReward?: number;

  @IsInt()
  order: number;

  @IsString()
  levelId: string;
}