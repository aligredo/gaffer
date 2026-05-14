import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tribe } from './entities/tribe.entity';
import { CreateTribeDto } from './dto/create-tribe.dto';
import { UpdateTribeDto } from './dto/update-tribe.dto';

@Injectable()
export class TribesService {
  constructor(
    @InjectRepository(Tribe)
    private readonly tribesRepository: Repository<Tribe>,
  ) {}

  async findAllByOwner(userId: string) {
    const tribes = await this.tribesRepository
      .createQueryBuilder('tribe')
      .leftJoinAndSelect('tribe.players', 'player')
      .leftJoinAndSelect('tribe.matches', 'match')
      .where('tribe.owner_id = :userId', { userId })
      .getMany();

    return tribes.map((tribe) => {
      const playerCount = tribe.players ? tribe.players.length : 0;
      const confirmedMatches = tribe.matches
        ? tribe.matches.filter((m) => m.status === 'confirmed')
        : [];
      const lastMatchDate =
        confirmedMatches.length > 0
          ? confirmedMatches.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )[0].date
          : null;

      const { players, matches, ...tribeData } = tribe;
      return { ...tribeData, playerCount, lastMatchDate };
    });
  }

  async findOne(id: string, userId: string) {
    const tribe = await this.tribesRepository.findOne({ where: { id } });
    if (!tribe) throw new NotFoundException('Tribe not found');
    if (tribe.ownerId !== userId) throw new ForbiddenException();
    return tribe;
  }

  async create(dto: CreateTribeDto, userId: string) {
    const tribe = this.tribesRepository.create({
      ...dto,
      ownerId: userId,
    });
    return this.tribesRepository.save(tribe);
  }

  async update(id: string, dto: UpdateTribeDto, userId: string) {
    const tribe = await this.findOne(id, userId);
    Object.assign(tribe, dto);
    return this.tribesRepository.save(tribe);
  }

  async remove(id: string, userId: string) {
    const tribe = await this.findOne(id, userId);
    await this.tribesRepository.remove(tribe);
    return { message: 'Tribe deleted' };
  }
}
