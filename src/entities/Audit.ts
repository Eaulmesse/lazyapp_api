import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "Audit" })
export class Audit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  url!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({ nullable: true })
  scorePerformance?: number;

  @Column({ nullable: true })
  scoreAccessibility?: number;

  @Column({ nullable: true })
  scoreBestPractices?: number;

  @Column({ nullable: true })
  scoreSEO?: number;

  @Column({ nullable: true })
  scorePWA?: number;

  @Column({ nullable: true })
  metrics?: string;

  @Column({ nullable: true })
  opportunities?: string;

  @Column({ nullable: true })
  diagnostics?: string;

  @Column({ nullable: true })
  recommendationsIA?: string;

  @Column({ nullable: true })
  rawLighthouseReport?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}