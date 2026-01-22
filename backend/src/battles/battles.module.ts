import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BattlesService } from './battles.service';
import { BattlesController } from './battles.controller';
import { Battle } from '../database/entities/battle.entity';
import { FleetsModule } from '../fleets/fleets.module';
import { PlanetsModule } from '../planets/planets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Battle]),
    FleetsModule,
    PlanetsModule,
    UsersModule,
  ],
  controllers: [BattlesController],
  providers: [BattlesService],
  exports: [BattlesService],
})
export class BattlesModule {}
