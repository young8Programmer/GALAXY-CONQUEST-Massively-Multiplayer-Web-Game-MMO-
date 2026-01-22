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
import { PlanetsService } from './planets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('planets')
@UseGuards(JwtAuthGuard)
export class PlanetsController {
  constructor(private readonly planetsService: PlanetsService) {}

  @Get()
  findAll() {
    return this.planetsService.findAll();
  }

  @Get('my')
  findMyPlanets(@Request() req) {
    return this.planetsService.findByOwner(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planetsService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() planetData: any) {
    return this.planetsService.create(req.user.id, planetData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateData: any) {
    return this.planetsService.update(id, req.user.id, updateData);
  }

  @Post(':id/upgrade/:buildingType')
  upgradeBuilding(
    @Param('id') id: string,
    @Param('buildingType') buildingType: string,
    @Request() req,
  ) {
    return this.planetsService.upgradeBuilding(id, req.user.id, buildingType);
  }
}
