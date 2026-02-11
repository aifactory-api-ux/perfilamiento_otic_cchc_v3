import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'Maria Lopez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: ['manager'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
