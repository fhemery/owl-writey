import { Module } from '@nestjs/common';

import { AuthGuard } from './middleware/auth.guard';
import { AuthRepository } from './repositories/auth.repository';
import { FirebaseAuthRepository } from './repositories/firebase-auth.repository';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [],
  providers: [
    AuthGuard,
    AuthService,
    { provide: AuthRepository, useClass: FirebaseAuthRepository },
  ],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
