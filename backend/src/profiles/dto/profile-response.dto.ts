import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({ example: 'Maria Lopez' })
  name!: string;

  @ApiProperty({ example: 'maria@example.com' })
  email!: string;

  @ApiProperty({ example: ['Scrum'] })
  skills!: string[];

  @ApiProperty({ example: 5 })
  experienceYears!: number;

  @ApiProperty({ example: ['PMP'] })
  certifications!: string[];

  @ApiProperty({ example: '2023-10-01T12:00:00.000Z' })
  createdAt!: Date;
}
