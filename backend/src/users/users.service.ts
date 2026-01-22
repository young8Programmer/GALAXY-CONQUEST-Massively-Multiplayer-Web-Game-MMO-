import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['planets', 'alliance'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['planets', 'alliance', 'fleets'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async updateLastActive(id: string): Promise<void> {
    await this.usersRepository.update(id, { lastActiveAt: new Date() });
  }

  async addResources(
    id: string,
    metal: number,
    gas: number,
    crystal: number,
  ): Promise<User> {
    const user = await this.findOne(id);
    user.metal += metal;
    user.gas += gas;
    user.crystal += crystal;
    return this.usersRepository.save(user);
  }

  async updateRating(id: string, ratingChange: number): Promise<User> {
    const user = await this.findOne(id);
    user.rating = Math.max(0, user.rating + ratingChange);
    return this.usersRepository.save(user);
  }
}
