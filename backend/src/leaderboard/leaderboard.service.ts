import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leaderboard, LeaderboardType } from '../database/entities/leaderboard.entity';
import { User } from '../database/entities/user.entity';
import { Alliance } from '../database/entities/alliance.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private leaderboardRepository: Repository<Leaderboard>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Alliance)
    private alliancesRepository: Repository<Alliance>,
  ) {}

  async getRatingLeaderboard(limit: number = 100) {
    const users = await this.usersRepository.find({
      order: { rating: 'DESC' },
      take: limit,
      select: ['id', 'username', 'rating', 'level'],
    });

    return users.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      rating: user.rating,
      level: user.level,
    }));
  }

  async getResourceLeaderboard(limit: number = 100) {
    const users = await this.usersRepository.find({
      take: limit,
      select: ['id', 'username', 'metal', 'gas', 'crystal'],
    });

    return users
      .map((user) => ({
        userId: user.id,
        username: user.username,
        totalResources: user.metal + user.gas + user.crystal,
        metal: user.metal,
        gas: user.gas,
        crystal: user.crystal,
      }))
      .sort((a, b) => b.totalResources - a.totalResources)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }))
      .slice(0, limit);
  }

  async getAllianceLeaderboard(limit: number = 100) {
    const alliances = await this.alliancesRepository.find({
      order: { score: 'DESC' },
      take: limit,
      relations: ['members'],
    });

    return alliances.map((alliance, index) => ({
      rank: index + 1,
      allianceId: alliance.id,
      name: alliance.name,
      tag: alliance.tag,
      score: alliance.score,
      memberCount: alliance.memberCount,
    }));
  }

  async updateSeasonalLeaderboard() {
    const seasonStart = new Date();
    seasonStart.setDate(seasonStart.getDate() - 7); // 7 days ago
    const seasonEnd = new Date();
    seasonEnd.setDate(seasonEnd.getDate() + 7); // 7 days from now

    // Rating leaderboard
    const ratingRankings = await this.getRatingLeaderboard(100);
    await this.leaderboardRepository.save({
      type: LeaderboardType.RATING,
      rankings: ratingRankings,
      seasonStart,
      seasonEnd,
    });

    // Resource leaderboard
    const resourceRankings = await this.getResourceLeaderboard(100);
    await this.leaderboardRepository.save({
      type: LeaderboardType.RESOURCES,
      rankings: resourceRankings,
      seasonStart,
      seasonEnd,
    });

    // Alliance leaderboard
    const allianceRankings = await this.getAllianceLeaderboard(100);
    await this.leaderboardRepository.save({
      type: LeaderboardType.ALLIANCE,
      rankings: allianceRankings,
      seasonStart,
      seasonEnd,
    });
  }
}
