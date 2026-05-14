import { Injectable } from '@nestjs/common';
import { Player } from '../players/entities/player.entity';

export interface TeamOutput {
  starters: Player[];
  sub: Player | null;
}

export interface GenerateTeamsOutput {
  teamA: TeamOutput;
  teamB: TeamOutput;
  balanceDelta: number;
  warnings: string[];
}

@Injectable()
export class TeamGeneratorService {
  private overall(p: Player): number {
    return Math.round((p.pace + p.shoot + p.pass + p.skill + p.physical) / 5);
  }

  generate(players: Player[]): GenerateTeamsOutput {
    const warnings: string[] = [];

    const gks = players
      .filter((p) => p.bestPosition === 'GK')
      .sort((a, b) => this.overall(b) - this.overall(a));

    let outfield = players.filter((p) => p.bestPosition !== 'GK');
    let teamAGk: Player | null = null;
    let teamBGk: Player | null = null;

    if (gks.length >= 2) {
      teamAGk = gks[0];
      teamBGk = gks[1];
      outfield = [...outfield, ...gks.slice(2)];
    } else {
      warnings.push(
        `Only ${gks.length} goalkeeper(s) selected — teams may be unbalanced`,
      );
      outfield = [...outfield, ...gks];
    }

    outfield.sort((a, b) => this.overall(b) - this.overall(a));

    const teamAOut: Player[] = [];
    const teamBOut: Player[] = [];

    outfield.forEach((p, i) => {
      const slot = i % 4;
      if (slot === 0 || slot === 3) {
        teamAOut.push(p);
      } else {
        teamBOut.push(p);
      }
    });

    let subA: Player | null = null;
    let subB: Player | null = null;

    if (players.length === 12) {
      subA = teamAOut.pop() ?? null;
      subB = teamBOut.pop() ?? null;
    }

    const teamAStarters = [...(teamAGk ? [teamAGk] : []), ...teamAOut];
    const teamBStarters = [...(teamBGk ? [teamBGk] : []), ...teamBOut];

    const avg = (arr: Player[]): number =>
      arr.length
        ? arr.reduce((s, p) => s + this.overall(p), 0) / arr.length
        : 0;

    const balanceDelta = Math.abs(avg(teamAStarters) - avg(teamBStarters));

    return {
      teamA: { starters: teamAStarters, sub: subA },
      teamB: { starters: teamBStarters, sub: subB },
      balanceDelta: Math.round(balanceDelta * 10) / 10,
      warnings,
    };
  }
}
