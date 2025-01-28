import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestModel, UserDetails } from '@owl/back/auth';
import { Role } from '@owl/shared/contracts';
import { NextFunction, Response } from 'express';

@Injectable()
export class FakeAuthMiddleware implements NestMiddleware {
  static currentUser: UserDetails | null = null;

  static SetUser(
    uid: string | null,
    roles: Role[] = [],
    isEmailVerified = true
  ): void {
    if (!uid) {
      FakeAuthMiddleware.currentUser = null;
      return;
    }
    FakeAuthMiddleware.currentUser = {
      uid,
      email: `${uid}@mail.com`,
      roles: roles,
      isEmailVerified,
    };
  }

  static Reset(): void {
    FakeAuthMiddleware.currentUser = null;
  }

  public async use(
    req: RequestModel,
    _: Response,
    next: NextFunction
  ): Promise<void> {
    req.user = FakeAuthMiddleware.currentUser;
    next();
  }
}
