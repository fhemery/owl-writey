import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'owl-novel-page',
  imports: [CommonModule],
  templateUrl: './novel-page.component.html',
  styleUrl: './novel-page.component.scss',
})
export class NovelPageComponent {
  id = input.required<string>();
}
