import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { IUser } from './user.domain.interface';
import { UserRepositoryInterface } from './user.repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(props: IUser): Promise<IUser> {
    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: props.email }, { username: props.username }],
      },
    });
    if (isUserExist) {
      throw new HttpException('User already exist', 400);
    }

    const user = await this.prismaService.user.create({
      data: props,
    });

    return user;
  }
}
