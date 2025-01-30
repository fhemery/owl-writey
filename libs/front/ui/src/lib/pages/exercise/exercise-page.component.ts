import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  ExerciseType = ExerciseType;
  private service = inject(ExerciseService);
  private route = inject(ActivatedRoute);

  exercise = signal<ExerciseDto | null>(null);

  async ngOnInit(): Promise<void> {
    const exercise = await this.service.getOne(
      this.route.snapshot.params['id']
    ); // TODO what happens if the return value is not good ?
    this.exercise.set(exercise);
  }
}
