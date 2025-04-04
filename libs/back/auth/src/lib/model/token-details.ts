import { Role } from '@owl/shared/common/contracts';

export interface TokenDetails {
  email: string;
  uid: string;
  roles: Role[];
}
