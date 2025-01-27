import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { FirebaseAuthService } from '@owl/front/auth';

@Component({
  selector: 'owl-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, MatToolbar, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(FirebaseAuthService);
  private readonly router = inject(Router);

  user = this.authService.user;
  isLoginEnabled = this.authService.isLoginEnabled;

  async logout() {
    await this.router.navigateByUrl('/login/logout');
  }
}
