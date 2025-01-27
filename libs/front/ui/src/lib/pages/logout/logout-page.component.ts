import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '@owl/front/auth';

@Component({
  selector: 'owl-logout-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutPageComponent implements OnInit {
  private readonly authService = inject(FirebaseAuthService);

  async ngOnInit() {
    await this.authService.logout();
  }
}
