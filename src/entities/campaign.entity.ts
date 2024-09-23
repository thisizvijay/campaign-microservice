import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column('decimal', { precision: 5, scale: 2 ,nullable: true})
  maxDiscountAmount: number;

  @Column('decimal', { precision: 5, scale: 2,nullable: true })
  minOrderAmount: number;

  @Column('decimal', { precision: 5, scale: 2 ,nullable: true})
  discountPercentage: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  modifiedAt: Date;
}