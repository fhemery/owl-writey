import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto } from '@owl/shared/contracts';

import { ExerciseLeaveDialogComponent } from '../exercise-leave-dialog/exercise-leave-dialog.component';
import { ExerciseShareDialogComponent } from '../exercise-share-dialog/exercise-share-dialog.component';

@Component({
  selector: 'owl-exercise-header-toolbar',
  imports: [CommonModule, MatIcon, TranslateModule, RouterLink],
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
    throw new Error('Method not implemented.');
  }

  edit(): void {
    throw new Error('Method not implemented.');
  }

  leave(): void {
    this.dialog.open(ExerciseLeaveDialogComponent, {
      data: { id: this.exercise().id },
    });
  }
}
