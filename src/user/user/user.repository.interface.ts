import { IUser } from './user.domain.interface';

export interface UserRepositoryInterface {
  create(props: IUser): Promise<IUser>;
}
