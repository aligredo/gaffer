import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Tribe } from '../../tribes/entities/tribe.entity';
import { MatchPlayer } from './match-player.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tribe_id' })
  tribeId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Tribe, (tribe) => tribe.matches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tribe_id' })
  tribe: Tribe;

  @OneToMany(() => MatchPlayer, (mp) => mp.match, { cascade: true })
  matchPlayers: MatchPlayer[];
}
