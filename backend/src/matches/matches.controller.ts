import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { GenerateTeamsDto } from './dto/generate-teams.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tribes/:tribeId/matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  findAll(
    @Param('tribeId', ParseUUIDPipe) tribeId: string,
    @Request() req: any,
  ) {
    return this.matchesService.findAll(tribeId, req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('tribeId', ParseUUIDPipe) tribeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.matchesService.findOne(tribeId, id, req.user.id);
  }

  @Post()
  create(
    @Param('tribeId', ParseUUIDPipe) tribeId: string,
    @Body() dto: CreateMatchDto,
    @Request() req: any,
  ) {
    return this.matchesService.create(tribeId, dto, req.user.id);
  }

  @Post(':id/generate')
  generate(
    @Param('tribeId', ParseUUIDPipe) tribeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: GenerateTeamsDto,
    @Request() req: any,
  ) {
    return this.matchesService.generateTeams(tribeId, id, dto, req.user.id);
  }

  @Post(':id/confirm')
  confirm(
    @Param('tribeId', ParseUUIDPipe) tribeId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: GenerateTeamsDto,
    @Request() req: any,
  ) {
    return this.matchesService.confirmMatch(tribeId, id, dto, req.user.id);
  }
}
