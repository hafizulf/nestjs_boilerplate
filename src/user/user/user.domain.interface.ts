export interface IUser {
  id?: string;
  full_name: string;
  email: string;
  username: string;
  password: string;
  avatar_path?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
