import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity()
  export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: false })
    firstName: string;
  
    @Column({ nullable: false })
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true, select: false, })
    password: string;
    
    @Index()
    @Column({ nullable: false })
    birthDate: Date;
  
    @Column({ default: true })
    isSubscribed: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    modifiedAt: Date;
  }
  