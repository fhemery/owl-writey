import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, resource } from '@angular/core';
import { UserDto } from '@owl/shared/common/contracts';
import { firstValueFrom } from 'rxjs';

import { AUTH_SERVICE } from '../auth.service.interface';
import { UserProfile } from '../model/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authService = inject(AUTH_SERVICE);
  private httpClient = inject(HttpClient);

  private userResource = resource({
    request: (): string | undefined => this.authService.user()?.uid,
    loader: ({ request }) =>
      request
        ? firstValueFrom(this.httpClient.get<UserDto>(`/api/users/${request}`))
        : Promise.resolve(undefined),
  });
  user = computed(() => {
    const user = this.authService.user();
    const profile = this.userResource.value();
    if (!user || !profile) {
      return null;
    }
    return new UserProfile(user.uid, user.email, profile.name, user.roles);
  });
}
