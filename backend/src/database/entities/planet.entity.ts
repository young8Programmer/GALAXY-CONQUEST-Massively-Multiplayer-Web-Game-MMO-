import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('planets')
export class Planet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  ownerId: string;

  @ManyToOne(() => User, (user) => user.planets, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ type: 'int' })
  x: number;

  @Column({ type: 'int' })
  y: number;

  @Column({ type: 'int' })
  system: number;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'bigint', default: 0 })
  metal: number;

  @Column({ type: 'bigint', default: 0 })
  gas: number;

  @Column({ type: 'bigint', default: 0 })
  crystal: number;

  // Buildings
  @Column({ type: 'int', default: 0 })
  metalMine: number;

  @Column({ type: 'int', default: 0 })
  gasMine: number;

  @Column({ type: 'int', default: 0 })
  crystalMine: number;

  @Column({ type: 'int', default: 0 })
  shipyard: number;

  @Column({ type: 'int', default: 0 })
  researchLab: number;

  @Column({ type: 'int', default: 0 })
  defenseStation: number;

  @Column({ type: 'timestamp', nullable: true })
  lastResourceUpdate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
