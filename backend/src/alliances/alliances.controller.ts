import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AlliancesService } from './alliances.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alliances')
@UseGuards(JwtAuthGuard)
export class AlliancesController {
  constructor(private readonly alliancesService: AlliancesService) {}

  @Get()
  findAll() {
    return this.alliancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alliancesService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() allianceData: any) {
    return this.alliancesService.create(req.user.id, allianceData);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Request() req) {
    return this.alliancesService.join(req.user.id, id);
  }

  @Delete('leave')
  leave(@Request() req) {
    return this.alliancesService.leave(req.user.id);
  }
}
