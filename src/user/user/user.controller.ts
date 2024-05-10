import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest, UserResponse } from './user.model';
import { WebResponse } from '../../common/web.model';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(
    @Body() request: CreateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.create(request);
    return {
      status: HttpStatus.CREATED,
      message: 'User created',
      data: user,
    };
  }
}
