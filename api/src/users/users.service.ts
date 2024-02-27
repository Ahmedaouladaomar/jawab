import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomInt } from 'crypto';
import generateHtml from 'src/mail/template';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private mailService: MailService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const dateCreated = new Date(Date.now());
    return this.usersRepository.save({ ...createUserDto, date_created: dateCreated });
  }

  async register(createUserDto: CreateUserDto){
    const { email, username } = createUserDto;
    let user: User, found: any, error = false;
    try {
      found = await this.findOneByUsernameOrEmail(email, username);
      if(found) throw new UnauthorizedException();
      user = await this.create(createUserDto);
    } catch (err) {
      error = true;
    }
    if(error) throw new UnauthorizedException();
    this.generateVerificationCode(user.id)
    return { user: user }
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({
      id: id
    });
  }

  findOneByUsernameOrEmail(email: string, username: string) {
    return this.usersRepository.findOne({
      where: [
        { username: username },
        { email: email }
      ]
    });
  }

  async findOneByUsername(username: string) {
    const res = await this.usersRepository.find({
      where: {
        username: username
      },
      relations: {
        threads: true
      }
    });

    return res[0];
  }

  findOneByVerificationCode(code: number) {
    return this.usersRepository.findOne({
      where: { verificationCode:  code}
    });
  }

  async generateVerificationCode(uid: number){
    const user = await this.findOne(uid);
    if(!user || user.isActive) return;

    let code = randomInt(999999);
    while(await this.findOneByVerificationCode(code)) code = randomInt(999999);

    // verification code exipres in 5 minutes
    user.verificationCode = code;
    user.verificationCodeExpireDate = new Date(Date.now() + 1000 * 60 * 5);

    // update fields
    const { id, ...result } = user;
    await this.update(id, result);

    const to = user.email;
    const subject = 'Verify your account';
    const html = generateHtml(code);
    this.mailService.sendMail(to, subject, html);
    return true;
  }

  async verifyEmail(id: number, code: number){
    let user = await this.findOne(id);
    if(!user || !user.verificationCode || !user.verificationCodeExpireDate) return;

    let dateExpire = new Date(user.verificationCodeExpireDate.toLocaleString());
    let expired = (new Date(Date.now()).valueOf() - dateExpire.valueOf()) >= 0;

    if(user.verificationCode != code || expired) return;
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id: id }, { ...updateUserDto });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
