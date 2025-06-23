import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  async createUser(name: string): Promise<boolean> {
    try {
      await firstValueFrom(this.httpClient.post('/api/users', { name }));
      return true;
    } catch {
      return false;
    }
  }
}
