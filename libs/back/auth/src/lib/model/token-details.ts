import { Role } from '@owl/shared/contracts';

export interface TokenDetails {
  email: string;
  uid: string;
  roles: Role[];
}
