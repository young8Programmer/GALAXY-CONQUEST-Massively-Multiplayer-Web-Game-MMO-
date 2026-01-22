import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PlanetsService } from '../planets/planets.service';
import { FleetsService } from '../fleets/fleets.service';
import { BattlesService } from '../battles/battles.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { FleetStatus } from '../database/entities/fleet.entity';

@Injectable()
export class GameService {
  constructor(
    private planetsService: PlanetsService,
    private fleetsService: FleetsService,
    private battlesService: BattlesService,
    private leaderboardService: LeaderboardService,
  ) {}

  // Run every minute - game tick
  @Cron(CronExpression.EVERY_MINUTE)
  async gameTick() {
    console.log('🔄 Game tick started...');

    // Update planet resources
    await this.updatePlanetResources();

    // Process fleet movements
    await this.fleetsService.processFleetArrivals();
    await this.fleetsService.processFleetReturns();

    // Process battles
    await this.processBattles();

    console.log('✅ Game tick completed');
  }

  // Update leaderboard daily
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateLeaderboards() {
    console.log('📊 Updating leaderboards...');
    await this.leaderboardService.updateSeasonalLeaderboard();
  }

  private async updatePlanetResources() {
    const planets = await this.planetsService.findAll();
    for (const planet of planets) {
      if (planet.ownerId) {
        await this.planetsService.generateResources(planet.id);
      }
    }
  }

  private async processBattles() {
    const fleets = await this.fleetsService.findAll();
    const attackingFleets = fleets.filter(
      (f) => f.status === FleetStatus.ATTACKING && f.arrivalTime && f.arrivalTime <= new Date(),
    );

    for (const fleet of attackingFleets) {
      if (fleet.destinationPlanetId) {
        try {
          await this.battlesService.processBattle(fleet.id, fleet.destinationPlanetId);
        } catch (error) {
          console.error(`Error processing battle for fleet ${fleet.id}:`, error);
        }
      }
    }
  }
}
