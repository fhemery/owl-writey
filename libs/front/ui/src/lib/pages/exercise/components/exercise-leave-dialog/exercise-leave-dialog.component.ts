import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FirebaseAuthService } from '@owl/front/auth';

import { ConfirmDialogComponent } from '../../../../components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../services/notification.service';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'owl-exercise-leave-dialog',
  imports: [CommonModule, ConfirmDialogComponent, TranslateModule],
  templateUrl: './exercise-leave-dialog.component.html',
  styleUrl: './exercise-leave-dialog.component.scss',
})
export class ExerciseLeaveDialogComponent {
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #notificationService = inject(NotificationService);
  readonly #translateService = inject(TranslateService);
  readonly #matData = inject(MAT_DIALOG_DATA);
  readonly #auth = inject(FirebaseAuthService);
  readonly #router = inject(Router);
  readonly #exerciseService = inject(ExerciseService);

  close(): void {
    this.#matDialogRef.close();
  }
  async leave(isConfirmed: boolean): Promise<void> {
    if (!isConfirmed) {
      this.close();
      return;
    }
    const result = await this.#exerciseService.removeParticipant(
      this.#matData.id,
      this.#auth.user()?.uid || ''
    );
    switch (result) {
      case 'Success':
        this.#notificationService.showSuccess(
          this.#translateService.instant('exercise.leave.result.ok')
        );
        await this.#router.navigateByUrl('/dashboard');
        break;
      case 'ErrorLastAdmin':
        this.#notificationService.showError(
          this.#translateService.instant('exercise.leave.result.errorLastAdmin')
        );
        break;
      case 'UnknownError':
        this.#notificationService.showError(
          this.#translateService.instant('exercise.leave.result.unknownError')
        );
        break;
    }
    this.close();
  }
}
