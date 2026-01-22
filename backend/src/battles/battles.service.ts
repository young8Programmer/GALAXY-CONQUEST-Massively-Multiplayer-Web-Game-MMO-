import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battle } from '../database/entities/battle.entity';
import { FleetsService } from '../fleets/fleets.service';
import { PlanetsService } from '../planets/planets.service';
import { UsersService } from '../users/users.service';
import { FleetStatus } from '../database/entities/fleet.entity';

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle)
    private battlesRepository: Repository<Battle>,
    private fleetsService: FleetsService,
    private planetsService: PlanetsService,
    private usersService: UsersService,
  ) {}

  async processBattle(fleetId: string, planetId: string): Promise<Battle> {
    const fleet = await this.fleetsService.findOne(fleetId);
    if (fleet.status !== FleetStatus.ATTACKING) {
      throw new Error('Fleet is not attacking');
    }

    const planet = await this.planetsService.findOne(planetId);
    const attacker = await this.usersService.findOne(fleet.ownerId);

    // Get defender
    let defender = null;
    let defenderFleet = null;
    if (planet.ownerId) {
      defender = await this.usersService.findOne(planet.ownerId);
      // Find defending fleet if any
      const defenderFleets = await this.fleetsService.findByOwner(planet.ownerId);
      defenderFleet = defenderFleets.find(f => f.status === FleetStatus.IDLE && f.originPlanetId === planetId);
    }

    // Calculate battle
    const battleResult = this.calculateBattle(
      fleet.units,
      defenderFleet?.units || {},
      attacker.rating,
      defender?.rating || 0,
    );

    // Determine winner
    const attackerPower = this.calculateFleetPower(fleet.units);
    const defenderPower = this.calculateFleetPower(defenderFleet?.units || {});
    const winnerId = attackerPower > defenderPower ? attacker.id : defender?.id;

    // Apply losses
    fleet.units = this.applyLosses(fleet.units, battleResult.attackerLosses);
    if (defenderFleet) {
      defenderFleet.units = this.applyLosses(defenderFleet.units, battleResult.defenderLosses);
      await this.fleetsService.update(defenderFleet.id, defender.id, defenderFleet);
    }

    // If attacker wins, steal resources
    if (winnerId === attacker.id && planet.ownerId) {
      const stolenResources = {
        metal: Math.floor(planet.metal * 0.1),
        gas: Math.floor(planet.gas * 0.1),
        crystal: Math.floor(planet.crystal * 0.1),
      };
      battleResult.resourcesStolen = stolenResources;
      await this.usersService.addResources(
        attacker.id,
        stolenResources.metal,
        stolenResources.gas,
        stolenResources.crystal,
      );
      planet.metal -= stolenResources.metal;
      planet.gas -= stolenResources.gas;
      planet.crystal -= stolenResources.crystal;
      await this.planetsService.update(planet.id, planet.ownerId, planet);
    }

    // Update ratings
    const ratingChange = this.calculateRatingChange(
      attacker.rating,
      defender?.rating || 1000,
      winnerId === attacker.id,
    );
    await this.usersService.updateRating(attacker.id, ratingChange);
    if (defender) {
      await this.usersService.updateRating(defender.id, -ratingChange);
    }

    // Save battle log
    const battle = this.battlesRepository.create({
      attackers: [{
        userId: attacker.id,
        username: attacker.username,
        fleetId: fleet.id,
        units: fleet.units,
      }],
      defenders: defender ? [{
        userId: defender.id,
        username: defender.username,
        fleetId: defenderFleet?.id,
        planetId: planet.id,
        units: defenderFleet?.units || {},
      }] : [],
      winnerId,
      result: battleResult,
      planetId,
      battleTime: new Date(),
    });

    return this.battlesRepository.save(battle);
  }

  async getBattleHistory(userId: string, limit: number = 50): Promise<Battle[]> {
    return this.battlesRepository
      .createQueryBuilder('battle')
      .where('battle.attackers @> :attacker', { attacker: JSON.stringify([{ userId }]) })
      .orWhere('battle.defenders @> :defender', { defender: JSON.stringify([{ userId }]) })
      .orderBy('battle.battleTime', 'DESC')
      .limit(limit)
      .getMany();
  }

  private calculateBattle(
    attackerUnits: Record<string, number>,
    defenderUnits: Record<string, number>,
    attackerRating: number,
    defenderRating: number,
  ): {
    attackerLosses: Record<string, number>;
    defenderLosses: Record<string, number>;
    resourcesStolen?: {
      metal: number;
      gas: number;
      crystal: number;
    };
  } {
    const attackerLosses: Record<string, number> = {};
    const defenderLosses: Record<string, number> = {};

    const attackerPower = this.calculateFleetPower(attackerUnits);
    const defenderPower = this.calculateFleetPower(defenderUnits);

    const totalPower = attackerPower + defenderPower;
    const attackerRatio = totalPower > 0 ? attackerPower / totalPower : 0.5;
    const defenderRatio = 1 - attackerRatio;

    // Apply rating bonus
    const ratingBonus = (attackerRating - defenderRating) / 1000;
    const adjustedAttackerRatio = Math.max(0.1, Math.min(0.9, attackerRatio + ratingBonus * 0.1));

    // Calculate losses
    for (const [unitType, count] of Object.entries(attackerUnits)) {
      attackerLosses[unitType] = Math.floor(count * defenderRatio * 0.3);
    }

    for (const [unitType, count] of Object.entries(defenderUnits)) {
      defenderLosses[unitType] = Math.floor(count * (1 - adjustedAttackerRatio) * 0.3);
    }

    return {
      attackerLosses,
      defenderLosses,
    };
  }

  private calculateFleetPower(units: Record<string, number>): number {
    const powerValues = {
      fighter: 10,
      bomber: 25,
      cruiser: 50,
      destroyer: 100,
      battleship: 200,
    };

    let totalPower = 0;
    for (const [unitType, count] of Object.entries(units)) {
      totalPower += (powerValues[unitType] || 10) * count;
    }
    return totalPower;
  }

  private applyLosses(units: Record<string, number>, losses: Record<string, number>): Record<string, number> {
    const result = { ...units };
    for (const [unitType, loss] of Object.entries(losses)) {
      result[unitType] = Math.max(0, (result[unitType] || 0) - loss);
    }
    return result;
  }

  private calculateRatingChange(attackerRating: number, defenderRating: number, attackerWon: boolean): number {
    const expectedScore = 1 / (1 + Math.pow(10, (defenderRating - attackerRating) / 400));
    const actualScore = attackerWon ? 1 : 0;
    const kFactor = 32;
    return Math.round(kFactor * (actualScore - expectedScore));
  }
}
