import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'owl-novel-settings-page',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './novel-settings-page.component.html',
  styleUrl: './novel-settings-page.component.scss',
})
export class NovelSettingsPageComponent {}
