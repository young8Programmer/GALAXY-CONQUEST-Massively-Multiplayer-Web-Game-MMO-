import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('battles')
export class Battle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  attackers: {
    userId: string;
    username: string;
    fleetId: string;
    units: Record<string, number>;
  }[];

  @Column({ type: 'jsonb' })
  defenders: {
    userId: string;
    username: string;
    fleetId?: string;
    planetId?: string;
    units: Record<string, number>;
  }[];

  @Column({ nullable: true })
  winnerId: string;

  @Column({ type: 'jsonb' })
  result: {
    attackerLosses: Record<string, number>;
    defenderLosses: Record<string, number>;
    resourcesStolen?: {
      metal: number;
      gas: number;
      crystal: number;
    };
  };

  @Column()
  planetId: string;

  @Column({ type: 'timestamp' })
  battleTime: Date;

  @CreateDateColumn()
  createdAt: Date;
}
