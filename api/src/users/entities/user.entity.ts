import { Comment } from 'src/threads/entities/comment.entity';
import { Thread } from 'src/threads/entities/thread.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;
  
  @Column({ 'type': 'timestamptz' })
  date_created: Date;

  @Column()
  verificationCode: number;

  @Column({ 'type': 'timestamptz' })
  verificationCodeExpireDate : Date;

  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[]
}