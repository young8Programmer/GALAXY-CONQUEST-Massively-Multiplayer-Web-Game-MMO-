import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FleetsService } from './fleets.service';
import { FleetsController } from './fleets.controller';
import { Fleet } from '../database/entities/fleet.entity';
import { UsersModule } from '../users/users.module';
import { PlanetsModule } from '../planets/planets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fleet]),
    UsersModule,
    PlanetsModule,
  ],
  controllers: [FleetsController],
  providers: [FleetsService],
  exports: [FleetsService],
})
export class FleetsModule {}
