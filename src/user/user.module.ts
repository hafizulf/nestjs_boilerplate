import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { UserDomain } from './user/user.domain';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserDomain],
})
export class UserModule {}
