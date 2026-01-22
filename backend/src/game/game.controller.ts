import { Controller, Get, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('status')
  getStatus() {
    return {
      status: 'online',
      timestamp: new Date().toISOString(),
    };
  }
}
