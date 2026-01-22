import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LeaderboardType {
  RATING = 'rating',
  RESOURCES = 'resources',
  FLEET = 'fleet',
  ALLIANCE = 'alliance',
}

@Entity('leaderboards')
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LeaderboardType,
  })
  type: LeaderboardType;

  @Column({ type: 'jsonb' })
  rankings: {
    userId: string;
    username: string;
    score: number;
    rank: number;
  }[];

  @Column({ type: 'timestamp' })
  seasonStart: Date;

  @Column({ type: 'timestamp' })
  seasonEnd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
