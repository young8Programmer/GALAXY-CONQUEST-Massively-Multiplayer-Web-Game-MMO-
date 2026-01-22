import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FleetsService } from './fleets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('fleets')
@UseGuards(JwtAuthGuard)
export class FleetsController {
  constructor(private readonly fleetsService: FleetsService) {}

  @Get()
  findAll() {
    return this.fleetsService.findAll();
  }

  @Get('my')
  findMyFleets(@Request() req) {
    return this.fleetsService.findByOwner(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fleetsService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() fleetData: any) {
    return this.fleetsService.create(req.user.id, fleetData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateData: any) {
    return this.fleetsService.update(id, req.user.id, updateData);
  }

  @Post(':id/build/:shipType')
  buildShips(
    @Param('id') id: string,
    @Param('shipType') shipType: string,
    @Body() body: { quantity: number },
    @Request() req,
  ) {
    return this.fleetsService.buildShips(id, req.user.id, shipType, body.quantity);
  }

  @Post(':id/send')
  sendFleet(
    @Param('id') id: string,
    @Body() body: { destinationPlanetId: string; isAttack?: boolean },
    @Request() req,
  ) {
    return this.fleetsService.sendFleet(
      id,
      req.user.id,
      body.destinationPlanetId,
      body.isAttack || false,
    );
  }
}
