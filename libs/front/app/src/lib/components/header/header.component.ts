
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@owl/front/auth';

@Component({
  selector: 'owl-header',
  standalone: true,
  imports: [
    TranslateModule,
    RouterLink,
    MatToolbar,
    MatButton,
    MatButtonModule,
    MatIcon,
    MatMenuModule,
    MatDivider
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  user = this.userService.user;

  async logout(): Promise<void> {
    await this.router.navigateByUrl('/login/logout');
  }
}
