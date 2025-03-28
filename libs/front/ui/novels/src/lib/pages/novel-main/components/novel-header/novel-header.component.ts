import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { NovelViewModel } from '../../../../model';

@Component({
  selector: 'owl-novel-header',
  imports: [CommonModule, MatIcon, RouterLink],
  templateUrl: './novel-header.component.html',
  styleUrl: './novel-header.component.scss',
})
export class NovelHeaderComponent {
  novel = input.required<NovelViewModel>();
}
