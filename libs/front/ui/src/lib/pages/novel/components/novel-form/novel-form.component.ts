import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

import { TextEditorComponent } from '../../../../components/text-editor/text-editor.component';

@Component({
  selector: 'owl-novel-form',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatError,
    MatButton,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    TranslateModule,
    MatInput,
    TextEditorComponent,
  ],
  templateUrl: './novel-form.component.html',
  styleUrl: './novel-form.component.scss',
})
export class NovelFormComponent {
  update = output<NovelFormData>();

  private readonly formBuilder = inject(FormBuilder);

  novelForm = this.formBuilder.group({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    description: new FormControl<string>(''),
  });

  updateDescription($event: string): void {
    this.novelForm.get('description')?.setValue($event);
  }

  onSubmit(): void {
    const values = this.novelForm.value;
    this.update.emit({
      title: values.title || '',
      description: values.description || '',
    });
  }
}

export interface NovelFormData {
  title: string;
  description: string;
}
