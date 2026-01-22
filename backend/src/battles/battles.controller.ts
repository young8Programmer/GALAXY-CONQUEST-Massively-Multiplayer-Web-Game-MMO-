import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { BattlesService } from './battles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('battles')
@UseGuards(JwtAuthGuard)
export class BattlesController {
  constructor(private readonly battlesService: BattlesService) {}

  @Get('history')
  getHistory(@Request() req) {
    return this.battlesService.getBattleHistory(req.user.id);
  }

  @Get('history/:userId')
  getUserHistory(@Param('userId') userId: string) {
    return this.battlesService.getBattleHistory(userId);
  }
}
