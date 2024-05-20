import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { IUser } from '../src/user/user/user.domain.interface';

interface IWhere {
  field: string;
  value: string;
}

@Injectable()
export class TestService {
  constructor(private readonly PrismaService: PrismaService) {}

  async truncateUsers() {
    await this.PrismaService.user.deleteMany();
  }

  async deleteUser(params: IWhere): Promise<IUser> {
    const user = await this.PrismaService.user.delete({
      where: {
        [params.field]: params.value
      } as any
    })
    return user;
  }

  async getUser(params: IWhere): Promise<IUser> {
    const user = await this.PrismaService.user.findFirst({
      where: {
        [params.field]: params.value
      } as any
    })
    return user;
  }

  async createUser(props: IUser): Promise<IUser> {
    const user = await this.PrismaService.user.create({
      data: props
    })
    return user;
  }
}
