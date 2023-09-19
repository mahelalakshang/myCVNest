import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder('reports')
      .leftJoinAndSelect('reports.user', 'user')
      .where('make= :make', { make: estimateDto.make })
      .andWhere('model= :model', { model: estimateDto.model })
      .getRawMany();
  }

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approved;
    return this.repo.save(report);
  }
}
// async changeApproval(id: string, approved: boolean) {
//   const report = await this.repo.findOne({ where: { id: parseInt(id) } });

//   ...

// }
