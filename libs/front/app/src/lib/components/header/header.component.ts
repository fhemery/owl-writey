import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FirebaseAuthService } from '@owl/front/auth';

@Component({
  selector: 'owl-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    RouterLink,
    MatToolbar,
    MatButton,
    MatIcon,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly authService = inject(FirebaseAuthService);
  private readonly router = inject(Router);

  user = this.authService.user;
  isLoginEnabled = this.authService.isLoginEnabled;

  async logout(): Promise<void> {
    await this.router.navigateByUrl('/login/logout');
  }
}
