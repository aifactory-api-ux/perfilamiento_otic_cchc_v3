import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'Maria Lopez' })
  name!: string;

  @ApiProperty({ example: ['admin'] })
  roles!: string[];

  @ApiProperty({ example: '2023-10-01T12:00:00.000Z' })
  createdAt!: Date;
}
