import { Role } from '@owl/shared/contracts';

export interface UserDetails {
  email: string;
  uid: string;
  roles: Role[];
  isEmailVerified: boolean;
}
