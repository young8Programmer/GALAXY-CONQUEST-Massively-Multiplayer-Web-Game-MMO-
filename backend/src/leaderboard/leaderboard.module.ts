import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { Leaderboard, LeaderboardType } from '../database/entities/leaderboard.entity';
import { User } from '../database/entities/user.entity';
import { Alliance } from '../database/entities/alliance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leaderboard, User, Alliance])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
