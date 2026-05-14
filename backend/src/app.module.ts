import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TribesModule } from './tribes/tribes.module';
import { PlayersModule } from './players/players.module';
import { MatchesModule } from './matches/matches.module';
import { User } from './users/entities/user.entity';
import { Tribe } from './tribes/entities/tribe.entity';
import { Player } from './players/entities/player.entity';
import { Match } from './matches/entities/match.entity';
import { MatchPlayer } from './matches/entities/match-player.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      synchronize: process.env.NODE_ENV !== 'production',
      migrationsRun: true,
      entities: [User, Tribe, Player, Match, MatchPlayer],
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UsersModule,
    TribesModule,
    PlayersModule,
    MatchesModule,
  ],
})
export class AppModule {}
