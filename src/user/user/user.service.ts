import { Injectable } from '@nestjs/common';
import { ValidationService } from '../../common/validation.service';
import { CreateUserRequest, UserResponse } from './user.model';
import { UserValidation } from './user.validation';
import { UserRepository } from './user.repository';
import { UserDomain } from './user.domain';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private userRepository: UserRepository,
  ) {}

  async create(request: CreateUserRequest): Promise<UserResponse> {
    const createRequest: CreateUserRequest = this.validationService.validate(
      UserValidation.CREATE,
      request,
    );

    createRequest.password = await bcrypt.hash(createRequest.password, 10);
    const user = new UserDomain(createRequest);
    return await this.userRepository.create(user.unmarshal());
  }
}
