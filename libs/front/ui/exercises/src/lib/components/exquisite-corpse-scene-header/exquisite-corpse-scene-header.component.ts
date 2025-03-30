import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  ExquisiteCorpseConfigDto,
  ExquisiteCorpseSceneDto,
} from '@owl/shared/exercises/contracts';

@Component({
  selector: 'owl-exquisite-corpse-scene-header',
  imports: [CommonModule],
  templateUrl: './exquisite-corpse-scene-header.component.html',
  styleUrl: './exquisite-corpse-scene-header.component.scss',
})
export class ExquisiteCorpseSceneHeaderComponent {
  scene = input.required<ExquisiteCorpseSceneDto>();
  sceneIndex = input.required<number>();
  config = input.required<ExquisiteCorpseConfigDto>();
}
