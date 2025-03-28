import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  NotificationService,
} from '@owl/front/ui/common';

import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'owl-exercise-finish-dialog',
  imports: [CommonModule, ConfirmDialogComponent, TranslateModule],
  templateUrl: './exercise-finish-dialog.component.html',
  styleUrl: './exercise-finish-dialog.component.scss',
})
export class ExerciseFinishDialogComponent {
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #notificationService = inject(NotificationService);
  readonly #matData: { link: string } = inject(MAT_DIALOG_DATA);
  readonly #router = inject(Router);
  readonly #exerciseService = inject(ExerciseService);

  close(): void {
    this.#matDialogRef.close();
  }
  async finish(isConfirmed: boolean): Promise<void> {
    if (!isConfirmed) {
      this.close();
      return;
    }
    const result = await this.#exerciseService.finish(this.#matData.link);

    if (result) {
      this.#notificationService.showSuccess('exercise.finish.result.ok');
      await this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showError('exercise.leave.result.error');
    }
    this.close();
  }
}
