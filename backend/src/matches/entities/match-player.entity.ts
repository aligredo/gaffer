import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Match } from './match.entity';
import { Player } from '../../players/entities/player.entity';

export enum TeamAssignment {
  A = 'A',
  B = 'B',
  SUB_A = 'SUB_A',
  SUB_B = 'SUB_B',
}

@Entity('match_players')
export class MatchPlayer {
  @PrimaryColumn({ name: 'match_id' })
  matchId: string;

  @PrimaryColumn({ name: 'player_id' })
  playerId: string;

  @Column({ length: 10 })
  team: string;

  @ManyToOne(() => Match, (match) => match.matchPlayers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'match_id' })
  match: Match;

  @ManyToOne(() => Player, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'player_id' })
  player: Player;
}
