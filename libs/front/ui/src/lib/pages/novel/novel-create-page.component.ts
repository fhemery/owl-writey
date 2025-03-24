import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import {
  NovelFormComponent,
  NovelFormData,
} from './components/novel-form/novel-form.component';
import { NovelService } from './services/novel.service';

@Component({
  selector: 'owl-novel-create-page',
  imports: [CommonModule, NovelFormComponent, TranslateModule],
  templateUrl: './novel-create-page.component.html',
  styleUrl: './novel-create-page.component.scss',
})
export class NovelCreatePageComponent {
  private novelService = inject(NovelService);
  private router = inject(Router);

  async createNovel($event: NovelFormData): Promise<void> {
    const novelId = await this.novelService.createNovel({
      title: $event.title,
      description: $event.description,
    });
    await this.router.navigate(['/novels', novelId]);
  }
}
