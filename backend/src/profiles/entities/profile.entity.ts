import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  skills!: string[];

  @Column({ type: 'int', default: 0 })
  experienceYears!: number;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  certifications!: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
