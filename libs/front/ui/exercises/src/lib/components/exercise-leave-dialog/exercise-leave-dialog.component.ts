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
  selector: 'owl-exercise-leave-dialog',
  imports: [CommonModule, ConfirmDialogComponent, TranslateModule],
  templateUrl: './exercise-leave-dialog.component.html',
  styleUrl: './exercise-leave-dialog.component.scss',
})
export class ExerciseLeaveDialogComponent {
  readonly #matDialogRef = inject(MatDialogRef);
  readonly #notificationService = inject(NotificationService);
  readonly #matData: { link: string } = inject(MAT_DIALOG_DATA);
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
      this.#matData.link
    );
    switch (result) {
      case 'Success':
        this.#notificationService.showSuccess('exercise.leave.result.ok');
        await this.#router.navigateByUrl('/dashboard');
        break;
      case 'ErrorLastAdmin':
        this.#notificationService.showError(
          'exercise.leave.result.errorLastAdmin'
        );
        break;
      case 'UnknownError':
        this.#notificationService.showError(
          'exercise.leave.result.unknownError'
        );
        break;
    }
    this.close();
  }
}
