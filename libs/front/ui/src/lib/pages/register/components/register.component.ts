import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
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
  selector: 'owl-register',
  imports: [
    CommonModule,
    MatButton,
    MatCard,
    MatInput,
    MatError,
    TranslateModule,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(FirebaseAuthService);

  registerForm = this.formBuilder.group(
    {
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      repeatPassword: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    },
    {
      validators: [areIdenticalPasswords()],
    }
  );

  registerError = signal(false);

  async onSubmit(): Promise<void> {
    const values = this.registerForm.value;
    this.registerError.set(false);

    const result = await this.authService.register(
      values.email || '',
      values.password || ''
    );
    if (!result) {
      this.registerError.set(true);
    }
  }
}

function areIdenticalPasswords(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');

    if (!password || !repeatPassword) {
      return null;
    }

    if (password?.value !== repeatPassword?.value) {
      return { passwordsNotMatch: true };
    }

    return null;
  };
}
