import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreateData } from './commands/user-create.data';
import { UserUpdateData } from './commands/user-update.data';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  async createUser(data: UserCreateData): Promise<User> {
    await Promise.all([
      this.validateUsername(data.username),
      this.validateEmail(data.email),
    ]);

    const { password, ...profile } = data;

    return this.userRepository.save({
      ...profile,
      password: await this.hashPassword(password),
    });
  }

  async updateUser(id: string, data: UserUpdateData): Promise<User> {
    const user = await this.findOneById(id);

    return this.userRepository.save({
      ...user,
      password: await this.hashPassword(data.password),
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findOneById(id);

    const { affected } = await this.userRepository.softDelete({ id: user.id });

    return affected > 0;
  }

  private async validateUsername(username: string): Promise<void> {
    const count = await this.userRepository.count({ where: { username } });
    if (count > 0) throw new ConflictException('DUPLICATED_USERNAME');
  }

  private async validateEmail(email: string): Promise<void> {
    const count = await this.userRepository.count({ where: { email } });
    if (count > 0) throw new ConflictException('DUPLICATED_USERNAME');
  }

  private async hashPassword(password: string): Promise<string> {
    const secretKey = this.configService.get<string>('APP_KET', '');
    return argon2.hash(password, { secret: Buffer.from(secretKey) });
  }
}
