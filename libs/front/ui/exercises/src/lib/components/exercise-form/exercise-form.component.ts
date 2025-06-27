
import { Component, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import {
  ExerciseDto,
  ExerciseStatus,
  ExerciseType,
} from '@owl/shared/exercises/contracts';

import { ExquisiteFormCorpseComponent } from '../exquisite-corpse-form/exquisite-form-corpse.component';

@Component({
  selector: 'owl-exercise-form',
  imports: [
    MatCard,
    TranslateModule,
    MatFormField,
    MatInput,
    MatCardContent,
    MatError,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    ExquisiteFormCorpseComponent,
    MatCardHeader,
    MatCardTitle
],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent {
  ExerciseType = ExerciseType;
  exercise = input<ExerciseDto | null>(null);
  update = output<ExerciseFormData>();

  private readonly formBuilder = inject(FormBuilder);

  exerciseForm = this.formBuilder.group({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    type: new FormControl<string>(ExerciseType.ExquisiteCorpse, [
      Validators.required,
    ]),
    details: new FormGroup({}),
  });

  onSubmit(): void {
    const values = this.exerciseForm.value;
    this.update.emit({
      id: this.exercise()?.id || '',
      name: values.name || '',
      type: values.type as ExerciseType,
      status: ExerciseStatus.Ongoing,
      config: values.details,
    });
  }
}

interface ExerciseFormData {
  id: string;
  name: string;
  type: ExerciseType;
  status: ExerciseStatus;
  config: unknown;
}
