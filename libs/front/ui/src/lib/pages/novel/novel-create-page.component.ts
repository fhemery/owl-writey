import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  NovelFormComponent,
  NovelFormData,
} from './components/novel-form/novel-form.component';

@Component({
  selector: 'owl-novel-create-page',
  imports: [CommonModule, NovelFormComponent, TranslateModule],
  templateUrl: './novel-create-page.component.html',
  styleUrl: './novel-create-page.component.scss',
})
export class NovelCreatePageComponent {
  async createNovel($event: NovelFormData): Promise<void> {
    console.log('Creating novel for', $event);
  }
}
