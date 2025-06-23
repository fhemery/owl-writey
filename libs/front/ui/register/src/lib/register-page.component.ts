
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE } from '@owl/front/auth';

import {
  RegisterComponent,
  RegisterData,
} from './components/register.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'owl-register-page',
  imports: [RegisterComponent, TranslateModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AUTH_SERVICE);
  private readonly router = inject(Router);

  registerError = signal(false);

  async register(data: RegisterData): Promise<void> {
    this.registerError.set(false);
    const result = await this.authService.register(
      data.email || '',
      data.password || ''
    );
    if (!result) {
      this.registerError.set(true);
      return;
    }

    await this.userService.createUser(data.name || '');
    await this.router.navigateByUrl('/dashboard');
  }
}
