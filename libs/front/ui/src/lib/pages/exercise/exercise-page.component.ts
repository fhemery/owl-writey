import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto, ExerciseType } from '@owl/shared/contracts';

import { ExquisiteCorpseDetailsComponent } from './components/exquisite-corpse-details/exquisite-corpse-details.component';
import { ExerciseService } from './services/exercise.service';

@Component({
  selector: 'owl-exercise-page',
  imports: [CommonModule, TranslateModule, ExquisiteCorpseDetailsComponent],
  templateUrl: './exercise-page.component.html',
  styleUrl: './exercise-page.component.scss',
})
export class ExercisePageComponent implements OnInit {
  id = input.required<string>();
  ExerciseType = ExerciseType;
  readonly #service = inject(ExerciseService);
  readonly #router = inject(Router);

  exercise = signal<ExerciseDto | null>(null);

  async ngOnInit(): Promise<void> {
    const exercise = await this.#service.getOne(this.id());
    if (!exercise) {
      this.#router.navigate(['/404']);
    }
    this.exercise.set(exercise);
  }
}
