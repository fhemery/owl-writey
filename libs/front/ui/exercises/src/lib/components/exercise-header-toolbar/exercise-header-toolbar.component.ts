import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  NotificationService,
} from '@owl/front/ui/common';
import { ExerciseDto, ExerciseStatus } from '@owl/shared/exercises/contracts';

import { ExerciseService } from '../../services/exercise.service';
import { ExerciseShareDialogComponent } from '../exercise-share-dialog/exercise-share-dialog.component';

@Component({
  selector: 'owl-exercise-header-toolbar',
  imports: [MatIcon, MatTooltip, TranslateModule],
  templateUrl: './exercise-header-toolbar.component.html',
  styleUrl: './exercise-header-toolbar.component.scss',
})
export class ExerciseHeaderToolbarComponent {
  readonly dialog = inject(MatDialog);
  readonly #dialogService = inject(ConfirmDialogService);
  readonly #exerciseService = inject(ExerciseService);
  readonly #notificationService = inject(NotificationService);
  readonly #router = inject(Router);

  isAdmin = input.required<boolean>();
  exercise = input.required<ExerciseDto>();

  generateLink(): void {
    this.dialog.open(ExerciseShareDialogComponent, {
      data: { id: this.exercise().id },
    });
  }

  async delete(): Promise<void> {
    const isConfirmed = await this.#dialogService.openConfirmDialog(
      'exercise.delete.title',
      'exercise.delete.message'
    );
    if (!isConfirmed) {
      return;
    }
    const result = await this.#exerciseService.delete(
      this.exercise()._links.delete || ''
    );
    if (result) {
      this.#notificationService.showSuccess('exercise.delete.result.ok');
      await this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showError('exercise.delete.result.error');
    }
  }

  edit(): void {
    throw new Error('Method not implemented.');
  }

  async leave(): Promise<void> {
    const isConfirmed = await this.#dialogService.openConfirmDialog(
      'exercise.leave.title',
      'exercise.leave.message'
    );
    if (!isConfirmed) {
      return;
    }
    const result = await this.#exerciseService.removeParticipant(
      this.exercise()._links.leave || ''
    );
    if (result) {
      this.#notificationService.showSuccess('exercise.leave.result.ok');
      await this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showError('exercise.leave.result.error');
    }
  }

  async finish(): Promise<void> {
    const isConfirmed = await this.#dialogService.openConfirmDialog(
      'exercise.finish.title',
      'exercise.finish.message'
    );
    if (!isConfirmed) {
      return;
    }
    const result = await this.#exerciseService.finish(
      this.exercise()._links.finish || ''
    );
    if (result) {
      this.#notificationService.showSuccess('exercise.finish.result.ok');
      await this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showError('exercise.leave.result.error');
    }
  }

  protected readonly ExerciseStatus = ExerciseStatus;
}
