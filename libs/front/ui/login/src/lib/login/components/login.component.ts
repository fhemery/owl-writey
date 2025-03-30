import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FirebaseAuthService } from '@owl/front/auth';

@Component({
  selector: 'owl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    TranslateModule,
    RouterLink,
  ],
  standalone: true,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(FirebaseAuthService);

  loginForm = this.formBuilder.group({
    login: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });

  loginError = signal(false);

  async onSubmit(): Promise<void> {
    const values = this.loginForm.value;
    this.loginError.set(false);
    const isLoggedIn = await this.authService.login(
      values.login || '',
      values.password || ''
    );
    if (!isLoggedIn) {
      this.loginError.set(true);
    }
  }
}
