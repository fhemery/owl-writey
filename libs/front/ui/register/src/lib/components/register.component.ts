import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';

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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);

  register = output<RegisterData>();

  registerForm = this.formBuilder.group(
    {
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
      ]),
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

  async onSubmit(): Promise<void> {
    const values = this.registerForm.value;
    this.register.emit({
      name: values.name || '',
      email: values.email || '',
      password: values.password || '',
    });
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

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
