import { Injectable } from '@nestjs/common';
import { ValidationService } from '../../common/validation.service';
import { CreateUserRequest, UserResponse } from './user.model';
import { UserValidation } from './user.validation';
import { UserRepository } from './user.repository';
import { UserDomain } from './user.domain';
import * as bcrypt from 'bcrypt';
import { FileService } from '../../common/file.service';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private userRepository: UserRepository,
  ) {}

  async create(
    request: CreateUserRequest,
    avatar_path: Express.Multer.File,
  ): Promise<UserResponse> {
    request.avatar_path = avatar_path;
    const createRequest: CreateUserRequest = this.validationService.validate(
      UserValidation.CREATE,
      request,
    );

    await this.userRepository.checkUserExist({
      email: createRequest.email,
      username: createRequest.username,
    });

    let avatar_path_filename = null;
    if (typeof createRequest.avatar_path === 'object') {
      const avatarPath = FileService.store(createRequest.avatar_path, 'user');
      avatar_path_filename = avatarPath;
    }
    createRequest.password = await bcrypt.hash(createRequest.password, 10);
    const user = new UserDomain({
      ...createRequest,
      avatar_path: avatar_path_filename,
    });
    return await this.userRepository.create(user.unmarshal());
  }
}
