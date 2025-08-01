
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseToCreateDto } from '@owl/shared/exercises/contracts';

import { ExerciseFormComponent } from '../../components/exercise-form/exercise-form.component';
import { ExerciseService } from '../../services/exercise.service';

@Component({
  selector: 'owl-exercise-new-page',
  imports: [TranslateModule, ExerciseFormComponent],
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
