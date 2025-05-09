import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
import { TextEditorComponent } from '@owl/front/ui/common';
import { Novel } from '@owl/shared/novels/model';

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
export class NovelFormComponent implements OnInit {
  update = output<NovelFormData>();
  delete = output<void>();
  novel = input<Novel | null>(null);
  isEditMode = computed(() => this.novel() !== null);

  private readonly formBuilder = inject(FormBuilder);
  novelForm!: FormGroup;

  ngOnInit(): void {
    this.novelForm = this.formBuilder.group({
      title: new FormControl<string>(this.novel()?.generalInfo.title || '', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl<string>(
        this.novel()?.generalInfo.description || ''
      ),
    });
  }

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

  onDelete(): void {
    this.delete.emit();
  }
}

export interface NovelFormData {
  title: string;
  description: string;
}
