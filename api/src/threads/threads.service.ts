import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { Thread } from './entities/thread.entity';
import { UsersService } from 'src/users/users.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class ThreadsService {
  constructor(
    private usersServive: UsersService,
    @InjectRepository(Thread)
    private threadsRepository: Repository<Thread>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(CreateThreadDto: CreateThreadDto): Promise<Thread> {
    const { userId, ...data } = CreateThreadDto;
    const { content } = data;
    const regex = /[^\s]/g;
    if(!userId || !content || content.search(regex) === -1) return;

    const user = await this.usersServive.findOne(userId);
    if(!user) return;

    const thread = new Thread();
    thread.content = data.content;
    thread.date_created = new Date(Date.now());
    thread.user = user;
    thread.reactions = [];
    
    return this.threadsRepository.save(thread);
  }

  async createComment(id: number, body: any): Promise<Thread> {
    const { userId, content } = body;

    const regex = /[^\s]/g;
    if(!userId || !id || !content || content.search(regex) === -1) return;

    const user = await this.usersServive.findOne(userId);
    if(!user) return;

    const thread = await this.findOne(id);
    if(!thread) return;

    const comment = new Comment();
    comment.content = content;
    comment.date_created = new Date(Date.now());
    comment.thread = thread;
    comment.user = user;
    comment.reactions = [];

    await this.commentsRepository.save(comment);
    
    return thread;
  }

  findAll() {
    return this.threadsRepository.find({
      relations: {
        user: true,
        comments: true
      }
    });
  }

  async findAllComments(id: number, pagination: any) {
    let { withPagination, itemsPerPage, pageNumber } = pagination;
    const thread = await this.findOne(id);
    if(!thread || withPagination && pageNumber < 1) return;

    pageNumber -= 1;

    if(!withPagination) {
      itemsPerPage = 0;
      pageNumber = 0;
    }

    const res = await this.commentsRepository.find({
      where: {
        thread: {
          id: thread.id
        }
      },
      relations: {
        user: true
      },
      skip: itemsPerPage * pageNumber,
      take: itemsPerPage
    });
    return res;
  }

  async findOne(id: number) {
    const res = await this.threadsRepository.find({
      where: { 
        id: id
      },
      relations: {
        user: true,
        comments: true
      }
    });
    return res[0];
  }

  async findByUserId(id: number) {
    const res = await this.threadsRepository.find({
      where: { 
        user: {
          id: id
        }
      },
      relations: {
        user: true,
      },
    });
    return res;
  }

  async update(id: number, UpdateThreadDto: UpdateThreadDto) {
    let thread = await this.findOne(id);
    const { content, action, user } = UpdateThreadDto;
    
    if(!thread) return;
    if(content) thread.content = content;

    let indexOfElement = thread.reactions.indexOf(user);
    let found = indexOfElement != -1;

    if(action && user){
      if(!found) thread.reactions.push(user);
      else {
        thread.reactions = thread.reactions
        .slice(0,indexOfElement)
        .concat(thread.reactions.slice(indexOfElement + 1));
      }
    }

    return this.threadsRepository.save(thread);
  }

  removeComment(id: number) {
    return this.commentsRepository.delete({ id: id });
  } 

  remove(id: number) {
    return this.threadsRepository.softDelete({ id: id });
  } 
}
