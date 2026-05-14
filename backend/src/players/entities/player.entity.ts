import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tribe } from '../../tribes/entities/tribe.entity';

export enum BestPosition {
  GK = 'GK',
  DEF = 'DEF',
  ATT = 'ATT',
  JOKER = 'JOKER',
}

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tribe_id' })
  tribeId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'best_position', length: 10 })
  bestPosition: string;

  @Column({ type: 'smallint' })
  pace: number;

  @Column({ type: 'smallint' })
  shoot: number;

  @Column({ type: 'smallint' })
  pass: number;

  @Column({ type: 'smallint' })
  skill: number;

  @Column({ type: 'smallint' })
  physical: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Tribe, (tribe) => tribe.players, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tribe_id' })
  tribe: Tribe;

  get overall(): number {
    return Math.round((this.pace + this.shoot + this.pass + this.skill + this.physical) / 5);
  }
}
