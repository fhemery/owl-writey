import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
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
    CommonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    MatSelect,
    MatOption,
    TranslateModule,
    ReactiveFormsModule,
    MatHint,
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
      new FormControl<number | null>(null, [Validators.min(0)])
    );
    this.form.addControl(
      'initialText',
      new FormControl<string>('', [
        Validators.required,
        Validators.minLength(50),
      ])
    );
    this.form.addControl(
      'iterationDuration',
      new FormControl<number | null>(900, [Validators.min(0)])
    );
  }
}
