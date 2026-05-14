import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class GenerateTeamsDto {
  @IsArray()
  @ArrayMinSize(10)
  @ArrayMaxSize(12)
  @IsUUID('4', { each: true })
  playerIds: string[];
}
