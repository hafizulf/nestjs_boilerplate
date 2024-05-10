import { IUser } from './user.domain.interface';
import { v4 as uuid } from 'uuid';

export class UserDomain {
  public id: string;
  public props: IUser;

  constructor(props: IUser, id?: string) {
    this.id = id ? id : uuid();
    this.props = props;
  }

  public static create(props: IUser): UserDomain {
    return new UserDomain(props);
  }

  unmarshal(): IUser {
    return {
      id: this.id,
      full_name: this.full_name,
      email: this.email,
      username: this.props.username,
      password: this.props.password,
      avatar_path: this.props.avatar_path,
    };
  }

  get full_name(): string {
    return this.props.full_name;
  }
  get email(): string {
    return this.props.email;
  }
  get username(): string {
    return this.props.username;
  }
  get password(): string {
    return this.props.password;
  }
  get avatar_path(): string {
    return this.props.avatar_path;
  }
}
