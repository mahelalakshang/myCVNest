import { Expose, Type } from 'class-transformer';
import { Report } from '../../reports/reports.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;
}

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => ReportDto)
  reports: ReportDto[];
}
