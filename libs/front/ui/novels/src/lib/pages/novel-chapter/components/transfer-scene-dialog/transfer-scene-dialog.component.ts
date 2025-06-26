import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { BaseDialogComponent } from '@owl/front/ui/common';
import { NovelScene } from '@owl/shared/novels/model';

import { NovelStore } from '../../../../services/novel.store';

@Component({
  selector: 'owl-transfer-scene-dialog',
  imports: [
    CommonModule,
    BaseDialogComponent,
    TranslateModule,
    MatExpansionModule,
    MatButton,
  ],
  templateUrl: './transfer-scene-dialog.component.html',
  styleUrl: './transfer-scene-dialog.component.scss',
})
export class TransferSceneDialogComponent {
  readonly #store = inject(NovelStore);
  readonly #dialog = inject(MatDialogRef);
  readonly data: { scene: NovelScene } = inject(MAT_DIALOG_DATA);

  readonly novel = this.#store.novel;
  readonly target = signal<{ chapterId: string; sceneIndex: number } | null>(
    null
  );

  doConfirm(): void {
    this.#dialog.close(this.target());
  }
  closeDialog(): void {
    this.#dialog.close(null);
  }
  updateTarget(chapterId: string, sceneIndex: number): void {
    this.target.set({ chapterId, sceneIndex });
  }
}
