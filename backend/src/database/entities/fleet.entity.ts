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

export enum FleetStatus {
  IDLE = 'idle',
  MOVING = 'moving',
  ATTACKING = 'attacking',
  RETURNING = 'returning',
}

@Entity('fleets')
export class Fleet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.fleets)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  name: string;

  @Column({ type: 'jsonb', default: {} })
  units: {
    fighter?: number;
    bomber?: number;
    cruiser?: number;
    destroyer?: number;
    battleship?: number;
  };

  @Column({
    type: 'enum',
    enum: FleetStatus,
    default: FleetStatus.IDLE,
  })
  status: FleetStatus;

  @Column({ nullable: true })
  originPlanetId: string;

  @Column({ nullable: true })
  destinationPlanetId: string;

  @Column({ type: 'timestamp', nullable: true })
  departureTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  arrivalTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
