import { Inject, Injectable } from '@nestjs/common';

import { UserDetails } from '../model';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class WsAuthService {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository
  ) {}

  async authenticate(authToken: string): Promise<UserDetails> {
    return await this.authRepository.getUserFromToken(authToken);
  }
}
