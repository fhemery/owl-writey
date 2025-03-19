export enum Role {
  User = 'User',
  Admin = 'Admin',
  Beta = 'Beta',
}

export interface UserDto {
  uid: string;
  name: string;
  email?: string;
}

export interface UserToCreateDto {
  name: string;
}

export interface UserRoleDto {
  role: Role;
}
