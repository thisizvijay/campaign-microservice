import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Customer } from './customer.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class ProductRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  relevanceScore: number;

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}