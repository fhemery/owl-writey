import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'owl-exquisite-form-corpse',
  imports: [
    CommonModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
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
  }
}
