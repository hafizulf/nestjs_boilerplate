import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest, UserResponse } from './user.model';
import { WebResponse } from '../../common/web.model';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar_path'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.create(body, file);
    return {
      status: HttpStatus.CREATED,
      message: 'User created',
      data: user,
    };
  }
}
