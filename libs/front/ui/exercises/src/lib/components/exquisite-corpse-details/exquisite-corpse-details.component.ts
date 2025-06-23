import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  SafeHtmlPipe,
  TextEditorComponent,
  TimeDiffPipe,
} from '@owl/front/ui/common';
import {
  ExerciseDto,
  ExerciseStatus,
  ExquisiteCorpseExerciseDto,
} from '@owl/shared/exercises/contracts';
import { SocketIoModule } from 'ngx-socket-io';

import { ExquisiteCorpseService } from '../../services/exquisite-corpse.service';
import { ExquisiteCorpseStore } from '../../services/exquisite-corpse.store';
import { ExquisiteCorpseSceneHeaderComponent } from '../exquisite-corpse-scene-header/exquisite-corpse-scene-header.component';

@Component({
  selector: 'owl-exquisite-corpse-details',
  imports: [
    CommonModule,
    SocketIoModule,
    TranslateModule,
    MatButton,
    MatIcon,
    TimeDiffPipe,
    SafeHtmlPipe,
    TextEditorComponent,
    ExquisiteCorpseSceneHeaderComponent,
  ],
  providers: [ExquisiteCorpseService, ExquisiteCorpseStore],
  templateUrl: './exquisite-corpse-details.component.html',
  styleUrl: './exquisite-corpse-details.component.scss',
})
export class ExquisiteCorpseDetailsComponent {
  readonly store = inject(ExquisiteCorpseStore);
  readonly ExerciseStatus = ExerciseStatus;

  exercise = input.required<ExerciseDto>();
  newContent = signal<string>('');
  isValid = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.store.setExercise(this.exercise() as ExquisiteCorpseExerciseDto);
    });
  }

  async takeTurn(): Promise<void> {
    await this.store.takeTurn();
  }

  updateContent($event: string): void {
    this.newContent.set($event);
  }

  async submitTurn(): Promise<void> {
    await this.store.submitTurn(this.newContent());
  }

  async cancelTurn(): Promise<void> {
    await this.store.cancelTurn();
  }

  updateValidity($event: boolean): void {
    this.isValid.set($event);
  }
}
