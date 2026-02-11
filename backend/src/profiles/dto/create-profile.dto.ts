import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 'Maria Lopez' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'maria@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: ['Project Management'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills!: string[];

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  experienceYears!: number;

  @ApiProperty({ example: ['PMP'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}
