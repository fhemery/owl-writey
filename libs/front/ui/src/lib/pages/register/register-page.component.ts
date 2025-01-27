import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { RegisterComponent } from './components/register.component';

@Component({
  selector: 'owl-register-page',
  imports: [CommonModule, RegisterComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {}
