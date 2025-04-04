import { Role } from '@owl/shared/common/contracts';

export interface UserDetails {
  email: string;
  uid: string;
  roles: Role[];
  isEmailVerified: boolean;
}
