import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { ReportRequestDto } from './dto/report-request.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profilesRepository: Repository<Profile>,
  ) {}

  async getSummary() {
    const [usersCount, profilesCount] = await Promise.all([
      this.usersRepository.count(),
      this.profilesRepository.count(),
    ]);

    return {
      usersCount,
      profilesCount,
      generatedAt: new Date().toISOString(),
    };
  }

  async getStatistics() {
    const profiles = await this.profilesRepository.find();
    const skillsMap = new Map<string, number>();

    profiles.forEach((profile) => {
      (profile.skills ?? []).forEach((skill) => {
        skillsMap.set(skill, (skillsMap.get(skill) ?? 0) + 1);
      });
    });

    const skills = Array.from(skillsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    return {
      totalProfiles: profiles.length,
      topSkills: skills.slice(0, 10),
      generatedAt: new Date().toISOString(),
    };
  }

  async exportReport(filters: ReportRequestDto) {
    const query = this.profilesRepository.createQueryBuilder('profile');
    if (filters.startDate) {
      query.andWhere('profile.createdAt >= :startDate', {
        startDate: filters.startDate,
      });
    }
    if (filters.endDate) {
      query.andWhere('profile.createdAt <= :endDate', { endDate: filters.endDate });
    }

    const profiles = await query.getMany();
    return {
      filters,
      total: profiles.length,
      data: profiles,
      generatedAt: new Date().toISOString(),
    };
  }
}
