import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@UseGuards(JwtAuthGuard)
@Controller('tribes/:id/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Param('id') tribeId: string, @Request() req) {
    return this.playersService.findAllByTribe(tribeId, req.user.id);
  }

  @Post()
  create(
    @Param('id') tribeId: string,
    @Body() dto: CreatePlayerDto,
    @Request() req,
  ) {
    return this.playersService.create(tribeId, dto, req.user.id);
  }

  @Patch(':pid')
  update(
    @Param('id') tribeId: string,
    @Param('pid') playerId: string,
    @Body() dto: UpdatePlayerDto,
    @Request() req,
  ) {
    return this.playersService.update(tribeId, playerId, dto, req.user.id);
  }

  @Delete(':pid')
  remove(
    @Param('id') tribeId: string,
    @Param('pid') playerId: string,
    @Request() req,
  ) {
    return this.playersService.remove(tribeId, playerId, req.user.id);
  }
}
