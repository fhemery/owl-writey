import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto, ExquisiteCorpseContentDto } from '@owl/shared/contracts';
import { SocketIoModule } from 'ngx-socket-io';

import { ExquisiteCorpseService } from '../../services/exquisite-corpse.service';

@Component({
  selector: 'owl-exquisite-corpse-details',
  imports: [CommonModule, SocketIoModule, TranslateModule, MatButton],
  providers: [ExquisiteCorpseService],
  templateUrl: './exquisite-corpse-details.component.html',
  styleUrl: './exquisite-corpse-details.component.scss',
})
export class ExquisiteCorpseDetailsComponent implements OnInit {
  exercise = input.required<ExerciseDto>();
  readonly #exquisiteCorpseService = inject(ExquisiteCorpseService);

  content = signal<ExquisiteCorpseContentDto | null>(null);

  ngOnInit(): void {
    // TODO : handle memory leak
    this.#exquisiteCorpseService.doConnect();
    this.#exquisiteCorpseService.updates.subscribe((content) => {
      this.content.set(content);
    });
    this.#exquisiteCorpseService.connectToExercise(this.exercise().id);
  }

  takeTurn(): void {
    throw new Error('Method not implemented.');
  }
}
