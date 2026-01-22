import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('leaderboard')
@UseGuards(JwtAuthGuard)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('rating')
  getRatingLeaderboard() {
    return this.leaderboardService.getRatingLeaderboard();
  }

  @Get('resources')
  getResourceLeaderboard() {
    return this.leaderboardService.getResourceLeaderboard();
  }

  @Get('alliances')
  getAllianceLeaderboard() {
    return this.leaderboardService.getAllianceLeaderboard();
  }
}
