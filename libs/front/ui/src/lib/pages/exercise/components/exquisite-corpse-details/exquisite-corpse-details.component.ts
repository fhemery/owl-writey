import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto, ExquisiteCorpseContentDto } from '@owl/shared/contracts';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { SocketIoModule } from 'ngx-socket-io';

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
  ],
  providers: [ExquisiteCorpseService, ExquisiteCorpseStore],
  templateUrl: './exquisite-corpse-details.component.html',
  styleUrl: './exquisite-corpse-details.component.scss',
})
export class ExquisiteCorpseDetailsComponent implements OnInit {
  readonly store = inject(ExquisiteCorpseStore);
  exercise = input.required<ExerciseDto>();

  content = signal<ExquisiteCorpseContentDto | null>(null);
  newContent = signal<string>('');

  ngOnInit(): void {
    this.store.setExercise(this.exercise());
  }

  takeTurn(): void {
    this.store.takeTurn();
  }

  updateContent($event: ContentChange): void {
    // TODO : Vérifier les CSRF (même si ça doit être bon avec Angular)
    this.newContent.set(($event.html?.replace(/&nbsp;/g, ' ') || '').trim());
  }

  submitTurn(): void {
    this.store.submitTurn(this.newContent());
  }
}
