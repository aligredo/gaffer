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
import { TribesService } from './tribes.service';
import { CreateTribeDto } from './dto/create-tribe.dto';
import { UpdateTribeDto } from './dto/update-tribe.dto';

@UseGuards(JwtAuthGuard)
@Controller('tribes')
export class TribesController {
  constructor(private readonly tribesService: TribesService) {}

  @Get()
  findAll(@Request() req) {
    return this.tribesService.findAllByOwner(req.user.id);
  }

  @Post()
  create(@Body() dto: CreateTribeDto, @Request() req) {
    return this.tribesService.create(dto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.tribesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTribeDto, @Request() req) {
    return this.tribesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.tribesService.remove(id, req.user.id);
  }
}
