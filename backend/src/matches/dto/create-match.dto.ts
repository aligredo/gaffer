import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateMatchDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
