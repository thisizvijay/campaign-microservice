import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from './discount.entity';

import { Product } from './product.entity';
import { Customer } from './customer.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class CampaignEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  customer: Customer;

  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @ManyToOne(() => Discount)
  discount: Discount;

  @Column()
  subject: string;

  @Column('text')
  emailContent: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ default: false })
  isOpened: boolean;

  @Column({ nullable: true })
  openAt: Date;

  @Column({ nullable: true })
  orderLink: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}
