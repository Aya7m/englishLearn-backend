import { IsString } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  optionId: string;
}