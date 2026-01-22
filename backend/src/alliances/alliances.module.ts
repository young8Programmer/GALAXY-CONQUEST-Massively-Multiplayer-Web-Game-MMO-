import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlliancesService } from './alliances.service';
import { AlliancesController } from './alliances.controller';
import { Alliance } from '../database/entities/alliance.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alliance]), UsersModule],
  controllers: [AlliancesController],
  providers: [AlliancesService],
  exports: [AlliancesService],
})
export class AlliancesModule {}
