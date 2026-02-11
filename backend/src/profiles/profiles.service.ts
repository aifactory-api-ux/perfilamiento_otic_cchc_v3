import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<ProfileResponseDto[]> {
    const profiles = await this.profilesRepository.find({
      order: { createdAt: 'DESC' },
    });
    return profiles.map((profile) => this.toResponse(profile));
  }

  async findOne(id: number): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return this.toResponse(profile);
  }

  async create(payload: CreateProfileDto): Promise<ProfileResponseDto> {
    const existing = await this.profilesRepository.findOne({
      where: { userId: payload.userId },
    });
    if (existing) {
      throw new ConflictException('Profile already exists for user');
    }

    const profile = this.profilesRepository.create({
      ...payload,
      certifications: payload.certifications ?? [],
    });
    const saved = await this.profilesRepository.save(profile);
    return this.toResponse(saved);
  }

  async update(id: number, payload: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (payload.userId && payload.userId !== profile.userId) {
      const existing = await this.profilesRepository.findOne({
        where: { userId: payload.userId },
      });
      if (existing) {
        throw new ConflictException('Profile already exists for user');
      }
    }

    Object.assign(profile, payload);
    const saved = await this.profilesRepository.save(profile);
    return this.toResponse(saved);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    await this.profilesRepository.remove(profile);
    return { deleted: true };
  }

  private toResponse(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      skills: profile.skills ?? [],
      experienceYears: profile.experienceYears ?? 0,
      certifications: profile.certifications ?? [],
      createdAt: profile.createdAt,
    };
  }
}
