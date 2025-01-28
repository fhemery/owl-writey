export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export interface UserDto {
  uid: string;
  name: string;
  email?: string;
}

export interface UserToCreateDto {
  name: string;
}
