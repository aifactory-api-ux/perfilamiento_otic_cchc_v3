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
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { KeycloakAuthGuard } from '../auth/guards/keycloak-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiResponseDecorator } from '../common/decorators/api-response.decorator';

@ApiTags('profiles')
@ApiBearerAuth()
@UseGuards(KeycloakAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @Roles('admin', 'manager')
  @ApiResponseDecorator({
    description: 'Listado de perfiles',
    model: ProfileResponseDto,
    isArray: true,
  })
  async findAll(): Promise<ProfileResponseDto[]> {
    return this.profilesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseDecorator({ description: 'Perfil encontrado', model: ProfileResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ProfileResponseDto> {
    return this.profilesService.findOne(id);
  }

  @Post()
  @Roles('admin', 'manager')
  @ApiBody({ type: CreateProfileDto })
  @ApiResponseDecorator({ description: 'Perfil creado', model: ProfileResponseDto })
  async create(@Body() payload: CreateProfileDto): Promise<ProfileResponseDto> {
    return this.profilesService.create(payload);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  @ApiBody({ type: UpdateProfileDto })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseDecorator({ description: 'Perfil actualizado', model: ProfileResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    return this.profilesService.update(id, payload);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseDecorator({ description: 'Perfil eliminado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.remove(id);
  }
}
