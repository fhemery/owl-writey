import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseToCreateDto } from '@owl/shared/contracts';

import { ExerciseFormComponent } from '../../components/exercise-form/exercise-form.component';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'owl-exercise-new-page',
  imports: [CommonModule, TranslateModule, ExerciseFormComponent],
  templateUrl: './exercise-new-page.component.html',
  styleUrl: './exercise-new-page.component.scss',
})
export class ExerciseNewPageComponent {
  readonly #exerciseService = inject(ExerciseService);
  readonly #router = inject(Router);

  async create(exercise: ExerciseToCreateDto): Promise<void> {
    const id = await this.#exerciseService.create(exercise);
    await this.#router.navigateByUrl(`/exercises/${id}`);
  }
}
