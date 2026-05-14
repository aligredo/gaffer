import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchPlayer, TeamAssignment } from './entities/match-player.entity';
import { Player } from '../players/entities/player.entity';
import { Tribe } from '../tribes/entities/tribe.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { GenerateTeamsDto } from './dto/generate-teams.dto';
import { TeamGeneratorService, GenerateTeamsOutput } from './team-generator.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private readonly matchRepo: Repository<Match>,
    @InjectRepository(MatchPlayer) private readonly mpRepo: Repository<MatchPlayer>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(Tribe) private readonly tribeRepo: Repository<Tribe>,
    private readonly teamGenerator: TeamGeneratorService,
    private readonly dataSource: DataSource,
  ) {}

  private async verifyTribeOwner(tribeId: string, userId: string): Promise<Tribe> {
    const tribe = await this.tribeRepo.findOne({ where: { id: tribeId } });
    if (!tribe) throw new NotFoundException('Tribe not found');
    if (tribe.ownerId !== userId) throw new ForbiddenException('Access denied');
    return tribe;
  }

  private async verifyMatch(tribeId: string, matchId: string): Promise<Match> {
    const match = await this.matchRepo.findOne({ where: { id: matchId, tribeId } });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async findAll(tribeId: string, userId: string): Promise<any[]> {
    await this.verifyTribeOwner(tribeId, userId);

    const matches = await this.matchRepo.find({
      where: { tribeId },
      order: { date: 'DESC' },
    });

    return Promise.all(matches.map((m) => this.formatMatch(m)));
  }

  async findOne(tribeId: string, matchId: string, userId: string): Promise<any> {
    await this.verifyTribeOwner(tribeId, userId);
    const match = await this.verifyMatch(tribeId, matchId);
    return this.formatMatch(match);
  }

  async create(tribeId: string, dto: CreateMatchDto, userId: string): Promise<any> {
    await this.verifyTribeOwner(tribeId, userId);

    const match = this.matchRepo.create({ tribeId, date: dto.date, notes: dto.notes, status: 'draft' });
    const saved = await this.matchRepo.save(match);
    return this.formatMatch(saved);
  }

  async generateTeams(
    tribeId: string,
    matchId: string,
    dto: GenerateTeamsDto,
    userId: string,
  ): Promise<any> {
    await this.verifyTribeOwner(tribeId, userId);
    await this.verifyMatch(tribeId, matchId);

    const players = await this.playerRepo.findByIds(dto.playerIds);
    const tribePlayerIds = new Set(
      (await this.playerRepo.find({ where: { tribeId } })).map((p) => p.id),
    );

    for (const p of players) {
      if (!tribePlayerIds.has(p.id)) {
        throw new BadRequestException(`Player ${p.id} does not belong to this tribe`);
      }
    }

    if (players.length !== dto.playerIds.length) {
      throw new BadRequestException('One or more players not found');
    }

    const result: GenerateTeamsOutput = this.teamGenerator.generate(players);

    return {
      teamA: result.teamA.starters.map((p) => this.formatPlayer(p)),
      teamB: result.teamB.starters.map((p) => this.formatPlayer(p)),
      subA: result.teamA.sub ? this.formatPlayer(result.teamA.sub) : null,
      subB: result.teamB.sub ? this.formatPlayer(result.teamB.sub) : null,
      balanceDelta: result.balanceDelta,
      warnings: result.warnings,
      // carry for confirm
      _raw: result,
    };
  }

  async confirmMatch(
    tribeId: string,
    matchId: string,
    dto: GenerateTeamsDto,
    userId: string,
  ): Promise<any> {
    await this.verifyTribeOwner(tribeId, userId);
    const match = await this.verifyMatch(tribeId, matchId);

    if (match.status === 'confirmed') {
      throw new BadRequestException('Match is already confirmed');
    }

    const players = await this.playerRepo.findByIds(dto.playerIds);
    if (players.length !== dto.playerIds.length) {
      throw new BadRequestException('One or more players not found');
    }

    const result: GenerateTeamsOutput = this.teamGenerator.generate(players);

    await this.dataSource.transaction(async (manager) => {
      // Remove any existing match players
      await manager.delete(MatchPlayer, { matchId });

      const assignments: Partial<MatchPlayer>[] = [
        ...result.teamA.starters.map((p) => ({ matchId, playerId: p.id, team: TeamAssignment.A })),
        ...result.teamB.starters.map((p) => ({ matchId, playerId: p.id, team: TeamAssignment.B })),
        ...(result.teamA.sub ? [{ matchId, playerId: result.teamA.sub.id, team: TeamAssignment.SUB_A }] : []),
        ...(result.teamB.sub ? [{ matchId, playerId: result.teamB.sub.id, team: TeamAssignment.SUB_B }] : []),
      ];

      await manager.save(MatchPlayer, assignments as MatchPlayer[]);
      await manager.update(Match, matchId, { status: 'confirmed' });
    });

    match.status = 'confirmed';
    return this.formatMatch(match, result);
  }

  private formatPlayer(p: Player): any {
    const overall = Math.round((p.pace + p.shoot + p.pass + p.skill + p.physical) / 5);
    return {
      id: p.id,
      name: p.name,
      bestPosition: p.bestPosition,
      pace: p.pace,
      shoot: p.shoot,
      pass: p.pass,
      skill: p.skill,
      physical: p.physical,
      tribeId: p.tribeId,
      overall,
      createdAt: p.createdAt,
    };
  }

  private async formatMatch(match: Match, generated?: GenerateTeamsOutput): Promise<any> {
    const matchPlayers = await this.mpRepo.find({
      where: { matchId: match.id },
      relations: ['player'],
    });

    const teamA = matchPlayers
      .filter((mp) => mp.team === TeamAssignment.A)
      .map((mp) => this.formatPlayer(mp.player));
    const teamB = matchPlayers
      .filter((mp) => mp.team === TeamAssignment.B)
      .map((mp) => this.formatPlayer(mp.player));
    const subA = matchPlayers.find((mp) => mp.team === TeamAssignment.SUB_A);
    const subB = matchPlayers.find((mp) => mp.team === TeamAssignment.SUB_B);

    return {
      id: match.id,
      tribeId: match.tribeId,
      date: match.date,
      status: match.status,
      notes: match.notes,
      teamA,
      teamB,
      subA: subA ? this.formatPlayer(subA.player) : null,
      subB: subB ? this.formatPlayer(subB.player) : null,
      balanceDelta: generated?.balanceDelta ?? null,
      warnings: generated?.warnings ?? [],
      createdAt: match.createdAt,
    };
  }
}
