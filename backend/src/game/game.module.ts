import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PlanetsModule } from '../planets/planets.module';
import { FleetsModule } from '../fleets/fleets.module';
import { BattlesModule } from '../battles/battles.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

@Module({
  imports: [PlanetsModule, FleetsModule, BattlesModule, LeaderboardModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
