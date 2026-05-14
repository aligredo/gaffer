import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateTribeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  schedule?: string;
}
