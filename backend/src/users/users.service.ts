import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find({ order: { createdAt: 'DESC' } });
    return users.map((user) => this.toResponse(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toResponse(user);
  }

  async create(payload: CreateUserDto): Promise<UserResponseDto> {
    const existing = await this.usersRepository.findOne({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const user = this.usersRepository.create({
      ...payload,
      roles: payload.roles ?? ['user'],
    });
    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  async update(id: number, payload: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (payload.email && payload.email !== user.email) {
      const existing = await this.usersRepository.findOne({ where: { email: payload.email } });
      if (existing) {
        throw new ConflictException('Email already registered');
      }
    }

    Object.assign(user, payload);
    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
    return { deleted: true };
  }

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles ?? [],
      createdAt: user.createdAt,
    };
  }
}
