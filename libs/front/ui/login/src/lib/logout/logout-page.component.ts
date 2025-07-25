
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AUTH_SERVICE } from '@owl/front/auth';

@Component({
  selector: 'owl-logout-page',
  standalone: true,
  imports: [],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutPageComponent implements OnInit {
  private readonly authService = inject(AUTH_SERVICE);

  async ngOnInit(): Promise<void> {
    await this.authService.logout();
  }
}
