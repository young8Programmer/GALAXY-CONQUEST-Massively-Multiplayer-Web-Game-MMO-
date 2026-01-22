import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alliance } from '../database/entities/alliance.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AlliancesService {
  constructor(
    @InjectRepository(Alliance)
    private alliancesRepository: Repository<Alliance>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, allianceData: Partial<Alliance>): Promise<Alliance> {
    const user = await this.usersService.findOne(userId);
    if (user.allianceId) {
      throw new ForbiddenException('You are already in an alliance');
    }

    const alliance = this.alliancesRepository.create(allianceData);
    const savedAlliance = await this.alliancesRepository.save(alliance);

    user.allianceId = savedAlliance.id;
    await this.usersService.update(userId, user);

    savedAlliance.memberCount = 1;
    return this.alliancesRepository.save(savedAlliance);
  }

  async findAll(): Promise<Alliance[]> {
    return this.alliancesRepository.find({
      relations: ['members'],
      order: { score: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Alliance> {
    const alliance = await this.alliancesRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!alliance) {
      throw new NotFoundException(`Alliance with ID ${id} not found`);
    }
    return alliance;
  }

  async join(userId: string, allianceId: string): Promise<Alliance> {
    const user = await this.usersService.findOne(userId);
    if (user.allianceId) {
      throw new ForbiddenException('You are already in an alliance');
    }

    const alliance = await this.findOne(allianceId);
    if (alliance.memberCount >= 50) {
      throw new ForbiddenException('Alliance is full');
    }

    user.allianceId = allianceId;
    await this.usersService.update(userId, user);

    alliance.memberCount += 1;
    return this.alliancesRepository.save(alliance);
  }

  async leave(userId: string): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user.allianceId) {
      throw new ForbiddenException('You are not in an alliance');
    }

    const alliance = await this.findOne(user.allianceId);
    user.allianceId = null;
    await this.usersService.update(userId, user);

    alliance.memberCount = Math.max(0, alliance.memberCount - 1);
    await this.alliancesRepository.save(alliance);
  }

  async updateScore(allianceId: string, scoreChange: number): Promise<Alliance> {
    const alliance = await this.findOne(allianceId);
    alliance.score += scoreChange;
    return this.alliancesRepository.save(alliance);
  }
}
