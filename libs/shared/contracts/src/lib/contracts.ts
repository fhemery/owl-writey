export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export interface UserDto {
  id: string;
  name: string;
  email?: string;
}
