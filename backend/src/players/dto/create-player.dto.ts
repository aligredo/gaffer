import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn(['GK', 'DEF', 'ATT', 'JOKER'])
  bestPosition: string;

  @IsInt()
  @Min(1)
  @Max(99)
  pace: number;

  @IsInt()
  @Min(1)
  @Max(99)
  shoot: number;

  @IsInt()
  @Min(1)
  @Max(99)
  pass: number;

  @IsInt()
  @Min(1)
  @Max(99)
  skill: number;

  @IsInt()
  @Min(1)
  @Max(99)
  physical: number;
}
