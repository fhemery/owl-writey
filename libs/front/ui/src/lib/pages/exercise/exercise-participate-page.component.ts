import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { NotificationService } from '../../services/notification.service';
import { ExerciseService } from './services/exercise.service';

@Component({
  selector: 'owl-exercise-participate-page',
  imports: [CommonModule],
  template: '',
  styles: '',
})
export class ExerciseParticipatePageComponent implements OnInit {
  readonly #exerciseService = inject(ExerciseService);
  readonly #notificationService = inject(NotificationService);
  readonly #translateService = inject(TranslateService);
  readonly #router = inject(Router);
  id = input.required<string>();

  async ngOnInit(): Promise<void> {
    const isAdded = await this.#exerciseService.addParticipant(this.id());
    if (!isAdded) {
      this.#notificationService.showError(
        this.#translateService.instant('exercise.participate.error')
      );
      await this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showSuccess(
        this.#translateService.instant('exercise.participate.success')
      );
      this.#router.navigateByUrl(`/exercises/${this.id()}`);
    }
  }
}
