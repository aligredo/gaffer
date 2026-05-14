import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { TeamGeneratorService } from './team-generator.service';
import { Match } from './entities/match.entity';
import { MatchPlayer } from './entities/match-player.entity';
import { Player } from '../players/entities/player.entity';
import { Tribe } from '../tribes/entities/tribe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, MatchPlayer, Player, Tribe])],
  controllers: [MatchesController],
  providers: [MatchesService, TeamGeneratorService],
})
export class MatchesModule {}
