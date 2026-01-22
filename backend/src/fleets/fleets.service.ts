import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fleet, FleetStatus } from '../database/entities/fleet.entity';
import { UsersService } from '../users/users.service';
import { PlanetsService } from '../planets/planets.service';

@Injectable()
export class FleetsService {
  constructor(
    @InjectRepository(Fleet)
    private fleetsRepository: Repository<Fleet>,
    private usersService: UsersService,
    private planetsService: PlanetsService,
  ) {}

  async create(userId: string, fleetData: Partial<Fleet>): Promise<Fleet> {
    const fleet = this.fleetsRepository.create({
      ...fleetData,
      ownerId: userId,
      status: FleetStatus.IDLE,
    });
    return this.fleetsRepository.save(fleet);
  }

  async findAll(): Promise<Fleet[]> {
    return this.fleetsRepository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: string): Promise<Fleet> {
    const fleet = await this.fleetsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!fleet) {
      throw new NotFoundException(`Fleet with ID ${id} not found`);
    }
    return fleet;
  }

  async findByOwner(userId: string): Promise<Fleet[]> {
    return this.fleetsRepository.find({
      where: { ownerId: userId },
    });
  }

  async update(id: string, userId: string, updateData: Partial<Fleet>): Promise<Fleet> {
    const fleet = await this.findOne(id);
    if (fleet.ownerId !== userId) {
      throw new ForbiddenException('You do not own this fleet');
    }
    Object.assign(fleet, updateData);
    return this.fleetsRepository.save(fleet);
  }

  async buildShips(
    fleetId: string,
    userId: string,
    shipType: string,
    quantity: number,
  ): Promise<Fleet> {
    const fleet = await this.findOne(fleetId);
    if (fleet.ownerId !== userId) {
      throw new ForbiddenException('You do not own this fleet');
    }

    const user = await this.usersService.findOne(userId);
    const cost = this.getShipCost(shipType, quantity);

    if (user.metal < cost.metal || user.gas < cost.gas || user.crystal < cost.crystal) {
      throw new ForbiddenException('Insufficient resources');
    }

    // Deduct resources
    user.metal -= cost.metal;
    user.gas -= cost.gas;
    user.crystal -= cost.crystal;
    await this.usersService.update(userId, user);

    // Add ships
    fleet.units[shipType] = (fleet.units[shipType] || 0) + quantity;
    return this.fleetsRepository.save(fleet);
  }

  async sendFleet(
    fleetId: string,
    userId: string,
    destinationPlanetId: string,
    isAttack: boolean = false,
  ): Promise<Fleet> {
    const fleet = await this.findOne(fleetId);
    if (fleet.ownerId !== userId) {
      throw new ForbiddenException('You do not own this fleet');
    }

    if (fleet.status !== FleetStatus.IDLE) {
      throw new ForbiddenException('Fleet is already in motion');
    }

    const destination = await this.planetsService.findOne(destinationPlanetId);
    const origin = await this.planetsService.findOne(fleet.originPlanetId);

    if (!origin) {
      throw new NotFoundException('Origin planet not found');
    }

    const distance = this.calculateDistance(origin, destination);
    const travelTime = this.calculateTravelTime(distance);
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + travelTime * 1000);

    fleet.status = isAttack ? FleetStatus.ATTACKING : FleetStatus.MOVING;
    fleet.destinationPlanetId = destinationPlanetId;
    fleet.departureTime = now;
    fleet.arrivalTime = arrivalTime;

    return this.fleetsRepository.save(fleet);
  }

  async processFleetArrivals(): Promise<void> {
    const now = new Date();
    const arrivingFleets = await this.fleetsRepository.find({
      where: [
        { status: FleetStatus.MOVING },
        { status: FleetStatus.ATTACKING },
      ],
    });

    for (const fleet of arrivingFleets) {
      if (fleet.arrivalTime && fleet.arrivalTime <= now) {
        if (fleet.status === FleetStatus.ATTACKING) {
          // Battle will be processed by battle service
          fleet.status = FleetStatus.RETURNING;
          const returnTime = new Date(now.getTime() + 30000); // 30 seconds return
          fleet.returnTime = returnTime;
        } else {
          fleet.status = FleetStatus.IDLE;
          fleet.originPlanetId = fleet.destinationPlanetId;
          fleet.destinationPlanetId = null;
        }
        await this.fleetsRepository.save(fleet);
      }
    }
  }

  async processFleetReturns(): Promise<void> {
    const now = new Date();
    const returningFleets = await this.fleetsRepository.find({
      where: { status: FleetStatus.RETURNING },
    });

    for (const fleet of returningFleets) {
      if (fleet.returnTime && fleet.returnTime <= now) {
        fleet.status = FleetStatus.IDLE;
        fleet.originPlanetId = fleet.destinationPlanetId;
        fleet.destinationPlanetId = null;
        fleet.returnTime = null;
        await this.fleetsRepository.save(fleet);
      }
    }
  }

  private getShipCost(shipType: string, quantity: number) {
    const costs = {
      fighter: { metal: 50, gas: 20, crystal: 10 },
      bomber: { metal: 100, gas: 50, crystal: 30 },
      cruiser: { metal: 200, gas: 100, crystal: 50 },
      destroyer: { metal: 400, gas: 200, crystal: 100 },
      battleship: { metal: 800, gas: 400, crystal: 200 },
    };

    const cost = costs[shipType] || costs.fighter;
    return {
      metal: cost.metal * quantity,
      gas: cost.gas * quantity,
      crystal: cost.crystal * quantity,
    };
  }

  private calculateDistance(origin: any, destination: any): number {
    const dx = destination.x - origin.x;
    const dy = destination.y - origin.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateTravelTime(distance: number): number {
    // Base speed: 1 unit per second, minimum 5 seconds
    return Math.max(5, Math.floor(distance));
  }
}
