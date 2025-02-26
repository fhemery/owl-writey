import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto, ExerciseStatus } from '@owl/shared/contracts';

import { ExerciseDeleteDialogComponent } from '../exercise-delete-dialog/exercise-delete-dialog.component';
import { ExerciseFinishDialogComponent } from '../exercise-finish-dialog/exercise-finish-dialog.component';
import { ExerciseLeaveDialogComponent } from '../exercise-leave-dialog/exercise-leave-dialog.component';
import { ExerciseShareDialogComponent } from '../exercise-share-dialog/exercise-share-dialog.component';

@Component({
  selector: 'owl-exercise-header-toolbar',
  imports: [CommonModule, MatIcon, TranslateModule],
  templateUrl: './exercise-header-toolbar.component.html',
  styleUrl: './exercise-header-toolbar.component.scss',
})
export class ExerciseHeaderToolbarComponent {
  readonly dialog = inject(MatDialog);

  isAdmin = input.required<boolean>();
  exercise = input.required<ExerciseDto>();

  generateLink(): void {
    this.dialog.open(ExerciseShareDialogComponent, {
      data: { id: this.exercise().id },
    });
  }

  delete(): void {
    this.dialog.open(ExerciseDeleteDialogComponent, {
      data: { id: this.exercise().id },
    });
  }

  edit(): void {
    throw new Error('Method not implemented.');
  }

  leave(): void {
    this.dialog.open(ExerciseLeaveDialogComponent, {
      data: { id: this.exercise().id },
    });
  }

  finish(): void {
    this.dialog.open(ExerciseFinishDialogComponent, {
      data: { id: this.exercise().id },
    });
  }

  protected readonly ExerciseStatus = ExerciseStatus;
}
