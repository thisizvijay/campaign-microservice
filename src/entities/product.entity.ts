import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  photoKey: string;

  @Column({ nullable: true })
  photoTemporaryUrl: string;

  @Column({ nullable: true })
  photoExpiresOn: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}

