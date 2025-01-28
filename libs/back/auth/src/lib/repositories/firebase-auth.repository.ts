import { Injectable } from '@nestjs/common';
import { Role } from '@owl/shared/contracts';
import * as admin from 'firebase-admin';
import { DecodedIdToken, UserRecord } from 'firebase-admin/lib/auth';

import { UserDetails, UserNotFoundException } from '../model';
import { AuthRepository } from './auth.repository';

@Injectable()
export class FirebaseAuthRepository implements AuthRepository {
  async getUserFromToken(token: string): Promise<UserDetails> {
    const decodedToken: DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);

    if (!decodedToken) {
      throw new UserNotFoundException();
    }

    return {
      email: decodedToken.email || '',
      uid: decodedToken.uid,
      roles: decodedToken['roles'] || [],
      isEmailVerified: decodedToken.email_verified || false,
    };
  }

  async getUserByUid(uid: string): Promise<UserDetails> {
    return await admin
      .auth()
      .getUser(uid)
      .then((user: UserRecord) => ({
        email: user.email || '',
        uid: user.uid,
        roles: user.customClaims?.['roles'] || [],
        isEmailVerified: user.emailVerified || false,
      }));
  }

  async setRoles(uid: string, roles: Role[]) {
    await admin.auth().setCustomUserClaims(uid, {
      roles,
    });
  }

  async setVerifiedUser(uid: string) {
    await admin.auth().updateUser(uid, {
      emailVerified: true,
    });
  }

  async changePassword(uid: string, password: string): Promise<void> {
    await admin.auth().updateUser(uid, {
      password,
    });
  }
}
