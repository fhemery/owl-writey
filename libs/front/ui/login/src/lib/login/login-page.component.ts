
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoginComponent } from './components/login.component';

@Component({
  selector: 'owl-login-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {}
