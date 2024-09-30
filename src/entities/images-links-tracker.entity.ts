import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class ImagesLinksTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  originalLink: string;

  @Column({ nullable: false })
  trackingHash: string;

  @Column({ type: 'enum', enum: ['link', 'image'], nullable: false })
  linkType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  modifiedAt: Date;
}
