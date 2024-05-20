import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { IUser } from './user.domain.interface';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(props: IUser): Promise<IUser> {
    const user = await this.prismaService.user.create({
      data: props,
    });
    return user;
  }

  async checkUserExist(props: Partial<IUser>): Promise<IUser> {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: props.email }, { username: props.username }],
      },
    });
    if (user) {
      throw new HttpException('User already exist', 400);
    }
    return user;
  }

  async get(id: string): Promise<IUser> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id,
      }
    })

    if(!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
