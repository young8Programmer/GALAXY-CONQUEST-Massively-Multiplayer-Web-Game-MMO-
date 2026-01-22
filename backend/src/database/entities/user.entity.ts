import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Planet } from './planet.entity';
import { Fleet } from './fleet.entity';
import { Alliance } from './alliance.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'int', default: 1000 })
  rating: number;

  @Column({ type: 'bigint', default: 0 })
  metal: number;

  @Column({ type: 'bigint', default: 1000 })
  gas: number;

  @Column({ type: 'bigint', default: 500 })
  crystal: number;

  @Column({ nullable: true })
  allianceId: string;

  @ManyToOne(() => Alliance, (alliance) => alliance.members, { nullable: true })
  @JoinColumn({ name: 'allianceId' })
  alliance: Alliance;

  @OneToMany(() => Planet, (planet) => planet.owner)
  planets: Planet[];

  @OneToMany(() => Fleet, (fleet) => fleet.owner)
  fleets: Fleet[];

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
