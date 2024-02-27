import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, DeleteDateColumn } from 'typeorm';
import { Comment } from './comment.entity';

@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column('json')
  reactions: number[];

  @Column({ 'type': 'timestamptz' })
  date_created: Date;

  @DeleteDateColumn({ 'type': 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.thread)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.threads)
  user: User;
}