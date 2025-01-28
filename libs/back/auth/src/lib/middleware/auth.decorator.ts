import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@owl/shared/contracts';

import { AuthGuard, RolesGuard } from './auth.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard)
  );
}
