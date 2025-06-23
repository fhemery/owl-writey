
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@owl/front/ui/common';

import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'owl-exercise-participate-page',
  imports: [],
  template: '',
  styles: '',
})
export class ExerciseParticipatePageComponent implements OnInit {
  readonly #exerciseService = inject(ExerciseService);
  readonly #notificationService = inject(NotificationService);
  readonly #router = inject(Router);
  id = input.required<string>();

  async ngOnInit(): Promise<void> {
    const isAdded = await this.#exerciseService.addParticipant(this.id());
    if (!isAdded) {
      this.#notificationService.showError('exercise.participate.error');
      await this.#router.navigateByUrl('/dashboard');
    } else {
      this.#notificationService.showSuccess('exercise.participate.success');
      await this.#router.navigateByUrl(`/exercises/${this.id()}`);
    }
  }
}
