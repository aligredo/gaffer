import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { Tribe } from '../tribes/entities/tribe.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playersRepository: Repository<Player>,
    @InjectRepository(Tribe)
    private readonly tribesRepository: Repository<Tribe>,
  ) {}

  private async verifyTribeOwnership(tribeId: string, userId: string): Promise<Tribe> {
    const tribe = await this.tribesRepository.findOne({ where: { id: tribeId } });
    if (!tribe) throw new NotFoundException('Tribe not found');
    if (tribe.ownerId !== userId) throw new ForbiddenException();
    return tribe;
  }

  private toResponse(player: Player) {
    return {
      ...player,
      overall: Math.round((player.pace + player.shoot + player.pass + player.skill + player.physical) / 5),
    };
  }

  async findAllByTribe(tribeId: string, userId: string) {
    await this.verifyTribeOwnership(tribeId, userId);
    const players = await this.playersRepository.find({ where: { tribeId } });
    return players.map((p) => this.toResponse(p));
  }

  async create(tribeId: string, dto: CreatePlayerDto, userId: string) {
    await this.verifyTribeOwnership(tribeId, userId);
    const player = this.playersRepository.create({ ...dto, tribeId });
    const saved = await this.playersRepository.save(player);
    return this.toResponse(saved);
  }

  async update(tribeId: string, playerId: string, dto: UpdatePlayerDto, userId: string) {
    await this.verifyTribeOwnership(tribeId, userId);
    const player = await this.playersRepository.findOne({
      where: { id: playerId, tribeId },
    });
    if (!player) throw new NotFoundException('Player not found');
    Object.assign(player, dto);
    const saved = await this.playersRepository.save(player);
    return this.toResponse(saved);
  }

  async remove(tribeId: string, playerId: string, userId: string) {
    await this.verifyTribeOwnership(tribeId, userId);
    const player = await this.playersRepository.findOne({
      where: { id: playerId, tribeId },
    });
    if (!player) throw new NotFoundException('Player not found');
    await this.playersRepository.remove(player);
    return { message: 'Player deleted' };
  }
}
