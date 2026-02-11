import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({ example: 'Maria Lopez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'maria@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: ['Scrum'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @ApiPropertyOptional({ example: ['PMP'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}
