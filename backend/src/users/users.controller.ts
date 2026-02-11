import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { KeycloakAuthGuard } from '../auth/guards/keycloak-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponseDecorator } from '../common/decorators/api-response.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(KeycloakAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiResponseDecorator({
    description: 'Listado de usuarios',
    model: UserResponseDto,
    isArray: true,
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseDecorator({ description: 'Usuario encontrado', model: UserResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBody({ type: CreateUserDto })
  @ApiResponseDecorator({ description: 'Usuario creado', model: UserResponseDto })
  async create(@Body() payload: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(payload);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseDecorator({ description: 'Usuario actualizado', model: UserResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseDecorator({ description: 'Usuario eliminado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
