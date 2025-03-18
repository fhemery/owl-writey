import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto, ExquisiteCorpseExerciseDto } from '@owl/shared/contracts';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { SocketIoModule } from 'ngx-socket-io';

import { TimeDiffPipe } from '../../../../services/time.pipe';
import { ExquisiteCorpseService } from '../../services/exquisite-corpse.service';
import { ExquisiteCorpseStore } from '../../services/exquisite-corpse.store';

@Component({
  selector: 'owl-exquisite-corpse-details',
  imports: [
    CommonModule,
    SocketIoModule,
    TranslateModule,
    MatButton,
    QuillEditorComponent,
    TimeDiffPipe,
  ],
  providers: [ExquisiteCorpseService, ExquisiteCorpseStore],
  templateUrl: './exquisite-corpse-details.component.html',
  styleUrl: './exquisite-corpse-details.component.scss',
})
export class ExquisiteCorpseDetailsComponent {
  readonly store = inject(ExquisiteCorpseStore);
  exercise = input.required<ExerciseDto>();

  newContent = signal<string>('');

  constructor() {
    effect(() => {
      console.log(JSON.stringify(this.exercise()));
      this.store.setExercise(this.exercise() as ExquisiteCorpseExerciseDto);
    });
  }

  async takeTurn(): Promise<void> {
    await this.store.takeTurn();
  }

  updateContent($event: ContentChange): void {
    this.newContent.set(($event.html?.replace(/&nbsp;/g, ' ') || '').trim());
  }

  async submitTurn(): Promise<void> {
    await this.store.submitTurn(this.newContent());
  }

  async cancelTurn(): Promise<void> {
    await this.store.cancelTurn();
  }
}
