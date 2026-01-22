import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planet } from '../database/entities/planet.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PlanetsService {
  constructor(
    @InjectRepository(Planet)
    private planetsRepository: Repository<Planet>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, planetData: Partial<Planet>): Promise<Planet> {
    const planet = this.planetsRepository.create({
      ...planetData,
      ownerId: userId,
    });
    return this.planetsRepository.save(planet);
  }

  async findAll(): Promise<Planet[]> {
    return this.planetsRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: string): Promise<Planet> {
    const planet = await this.planetsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!planet) {
      throw new NotFoundException(`Planet with ID ${id} not found`);
    }
    return planet;
  }

  async findByOwner(userId: string): Promise<Planet[]> {
    return this.planetsRepository.find({
      where: { ownerId: userId },
    });
  }

  async findByCoordinates(
    system: number,
    position: number,
  ): Promise<Planet | null> {
    return this.planetsRepository.findOne({
      where: { system, position },
    });
  }

  async update(id: string, userId: string, updateData: Partial<Planet>): Promise<Planet> {
    const planet = await this.findOne(id);
    if (planet.ownerId !== userId) {
      throw new ForbiddenException('You do not own this planet');
    }
    Object.assign(planet, updateData);
    return this.planetsRepository.save(planet);
  }

  async upgradeBuilding(
    id: string,
    userId: string,
    buildingType: string,
  ): Promise<Planet> {
    const planet = await this.findOne(id);
    if (planet.ownerId !== userId) {
      throw new ForbiddenException('You do not own this planet');
    }

    const user = await this.usersService.findOne(userId);
    const cost = this.getBuildingCost(buildingType, planet[buildingType] || 0);

    if (user.metal < cost.metal || user.gas < cost.gas || user.crystal < cost.crystal) {
      throw new ForbiddenException('Insufficient resources');
    }

    // Deduct resources
    user.metal -= cost.metal;
    user.gas -= cost.gas;
    user.crystal -= cost.crystal;
    await this.usersService.update(userId, user);

    // Upgrade building
    planet[buildingType] = (planet[buildingType] || 0) + 1;
    return this.planetsRepository.save(planet);
  }

  async generateResources(planetId: string): Promise<Planet> {
    const planet = await this.findOne(planetId);
    const now = new Date();
    const lastUpdate = planet.lastResourceUpdate || planet.createdAt;
    const minutesPassed = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / 60000,
    );

    if (minutesPassed > 0) {
      const metalPerMinute = 10 + planet.metalMine * 5;
      const gasPerMinute = 5 + planet.gasMine * 3;
      const crystalPerMinute = 3 + planet.crystalMine * 2;

      planet.metal += metalPerMinute * minutesPassed;
      planet.gas += gasPerMinute * minutesPassed;
      planet.crystal += crystalPerMinute * minutesPassed;
      planet.lastResourceUpdate = now;
      return this.planetsRepository.save(planet);
    }

    return planet;
  }

  private getBuildingCost(buildingType: string, currentLevel: number) {
    const baseCost = {
      metalMine: { metal: 50, gas: 20, crystal: 10 },
      gasMine: { metal: 40, gas: 30, crystal: 15 },
      crystalMine: { metal: 30, gas: 25, crystal: 20 },
      shipyard: { metal: 100, gas: 50, crystal: 30 },
      researchLab: { metal: 80, gas: 60, crystal: 40 },
      defenseStation: { metal: 120, gas: 40, crystal: 50 },
    };

    const cost = baseCost[buildingType] || baseCost.metalMine;
    const multiplier = Math.pow(1.5, currentLevel);

    return {
      metal: Math.floor(cost.metal * multiplier),
      gas: Math.floor(cost.gas * multiplier),
      crystal: Math.floor(cost.crystal * multiplier),
    };
  }
}
