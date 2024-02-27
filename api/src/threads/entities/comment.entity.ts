import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Thread } from './thread.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column('bigint', { array: true })
  reactions: number[];

  @Column({ 'type': 'timestamptz' })
  date_created: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Thread, (thread) => thread.comments)
  thread: Thread;
}