import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../services/notification.service';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'owl-exercise-delete-dialog',
  imports: [CommonModule, ConfirmDialogComponent, TranslateModule],
  templateUrl: './exercise-delete-dialog.component.html',
  styleUrl: './exercise-delete-dialog.component.scss',
})
export class ExerciseDeleteDialogComponent {
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #notificationService = inject(NotificationService);
  readonly #translateService = inject(TranslateService);
  readonly #matData = inject(MAT_DIALOG_DATA);
  readonly #router = inject(Router);
  readonly #exerciseService = inject(ExerciseService);

  async confirmDeletion(isDeleteConfirmed: boolean): Promise<void> {
    if (!isDeleteConfirmed) {
      this.close();
      return;
    }

    const result = await this.#exerciseService.delete(this.#matData.id);
    if (result) {
      this.#notificationService.showSuccess(
        this.#translateService.instant('exercise.delete.result.ok')
      );
      this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showError(
        this.#translateService.instant('exercise.delete.result.error')
      );
    }
    this.close();
  }

  private close(): void {
    this.#matDialogRef.close();
  }
}
