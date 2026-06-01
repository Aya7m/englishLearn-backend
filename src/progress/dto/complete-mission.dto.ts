import { IsInt, Min } from 'class-validator';

export class CompleteMissionDto {
  @IsInt()
  @Min(0)
  score: number;
}