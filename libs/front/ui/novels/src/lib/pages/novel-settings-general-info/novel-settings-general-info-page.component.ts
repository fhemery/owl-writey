
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@owl/front/ui/common';

import {
  NovelFormComponent,
  NovelFormData,
} from '../../components/novel-form/novel-form.component';
import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelDeleteConfirmComponent } from './components/novel-delete-confirm/novel-delete-confirm.component';

@Component({
  selector: 'owl-novel-settings-general-info-page',
  imports: [NovelFormComponent],
  templateUrl: './novel-settings-general-info-page.component.html',
  styleUrl: './novel-settings-general-info-page.component.scss',
})
export class NovelSettingsGeneralInfoPageComponent {
  readonly dialog = inject(MatDialog);
  readonly store = inject(NovelStore);
  readonly notificationService = inject(NotificationService);

  novel = this.store.novel;

  readonly #novelContext = inject(NovelContextService);

  constructor() {
    this.#novelContext.reset();
  }

  async update($event: NovelFormData): Promise<void> {
    let result = true;
    if ($event.title !== this.novel()?.generalInfo.title) {
      result &&= await this.store.updateTitle($event.title);
    }
    if ($event.description !== this.novel()?.generalInfo.description) {
      result &&= await this.store.updateDescription($event.description);
    }
    if (!result) {
      this.notificationService.showError('novel.edit.result.ko');
    } else {
      this.notificationService.showSuccess('novel.edit.result.ok');
    }
  }

  deleteNovel(): void {
    this.dialog.open(NovelDeleteConfirmComponent, {});
  }
}
