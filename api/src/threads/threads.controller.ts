import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Post()
  async create(@Body() createThreadDto: CreateThreadDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.threadsService.create(createThreadDto);
    if(!result) response.status(300);
    return result;
  }

  @Post(':id/comments')
  async createComment(@Param('id') id: string, @Body() body: any, @Res({ passthrough: true }) response: Response){
    const result = await this.threadsService.createComment(+id, body);
    if(!result) response.status(300);
    return result;
  }

  @Get()
  findAll() {
    return this.threadsService.findAll();
  }

  @Get(':id/comments')
  findAllComments(@Param('id') id: string, @Body() pagination: any) {
    return this.threadsService.findAllComments(+id, pagination);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.threadsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThreadDto: UpdateThreadDto) {
    return this.threadsService.update(+id, updateThreadDto);
  }

  @Delete('comments/:id')
  removeComment(@Param('id') id: string) {
    return this.threadsService.removeComment(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.threadsService.remove(+id);
  }
}
