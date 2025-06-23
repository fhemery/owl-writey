
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'owl-exquisite-form-corpse',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    TranslateModule,
    ReactiveFormsModule,
    MatHint
],
  templateUrl: './exquisite-form-corpse.component.html',
  styleUrl: './exquisite-form-corpse.component.scss',
})
export class ExquisiteFormCorpseComponent implements OnInit {
  @Input()
  parentForm?: FormGroup;

  form?: FormGroup;

  ngOnInit(): void {
    if (!this.parentForm) {
      return;
    }
    this.form = this.parentForm.get('details') as FormGroup;

    this.form.addControl(
      'nbIterations',
      new FormControl<number | null>(null, [Validators.min(1)])
    );
    this.form.addControl(
      'initialText',
      new FormControl<string>('', [Validators.required])
    );
    this.form.addControl(
      'iterationDuration',
      new FormControl<number | null>(900, [Validators.min(1)])
    );
    const textSize = new FormGroup(
      {
        minWords: new FormControl<number | null>(null, [Validators.min(1)]),
        maxWords: new FormControl<number | null>(null, [Validators.min(1)]),
      },
      { validators: [shouldHaveMaxWordsGreaterThanMinWords()] }
    );
    this.form.addControl('textSize', textSize);
  }
}

function shouldHaveMaxWordsGreaterThanMinWords(): ValidatorFn {
  return (controls: AbstractControl): ValidationErrors | null => {
    const minWords = controls.get('minWords')?.value;
    const maxWords = controls.get('maxWords')?.value;
    if (minWords && maxWords && parseInt(maxWords) < parseInt(minWords)) {
      return { maxWordsLessThanMinWords: true };
    }
    return null;
  };
}
