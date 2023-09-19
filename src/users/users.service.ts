import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }
  getReports(user: User) {
    console.log(user);
    // return this.repo
    //   .createQueryBuilder('user')
    //   .select('*')
    //   .leftJoinAndSelect('user.reports', 'reports')
    //   .getRawMany();
    return this.repo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.reports', 'reports')
      .where('user.id = :userId', { userId: user.id })
      .getMany();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    console.log(id);
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    this.repo.remove(user);
  }
}
