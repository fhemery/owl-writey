
import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseType } from '@owl/shared/exercises/contracts';

import { ExerciseHeaderToolbarComponent } from '../../components/exercise-header-toolbar/exercise-header-toolbar.component';
import { ExerciseParticipantsListComponent } from '../../components/exercise-participants-list/exercise-participants-list.component';
import { ExquisiteCorpseDetailsComponent } from '../../components/exquisite-corpse-details/exquisite-corpse-details.component';
import { ExerciseService } from '../../services/exercise.service';
import { ExerciseStore } from '../../services/exercise.store';

@Component({
  selector: 'owl-exercise-page',
  imports: [
    TranslateModule,
    ExquisiteCorpseDetailsComponent,
    ExerciseHeaderToolbarComponent,
    ExerciseParticipantsListComponent
],
  providers: [ExerciseStore],
  templateUrl: './exercise-page.component.html',
  styleUrl: './exercise-page.component.scss',
})
export class ExercisePageComponent implements OnInit {
  readonly store = inject(ExerciseStore);
  id = input.required<string>();
  ExerciseType = ExerciseType;

  readonly #service = inject(ExerciseService);
  readonly #router = inject(Router);

  async ngOnInit(): Promise<void> {
    const exercise = await this.#service.getOne(this.id());
    if (!exercise) {
      await this.#router.navigate(['/404']);
      return;
    }
    await this.store.setExercise(exercise);
  }
}
