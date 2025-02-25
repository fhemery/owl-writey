import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../services/notification.service';
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
  readonly #translateService = inject(TranslateService);
  readonly #matData = inject(MAT_DIALOG_DATA);
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
    const result = await this.#exerciseService.finish(this.#matData.id);

    if (result) {
      this.#notificationService.showSuccess(
        this.#translateService.instant('exercise.finish.result.ok')
      );
      this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showError(
        this.#translateService.instant('exercise.leave.result.error')
      );
    }
    this.close();
  }
}
