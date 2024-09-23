import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column()
  code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  usedDiscountAmount: number;

  @Column({ default: false })
  isUsed: boolean;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  expireDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}