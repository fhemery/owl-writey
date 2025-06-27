
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import {
  NovelHtmlExporter,
  NovelHtmlExportOptions,
} from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';

@Component({
  selector: 'owl-novel-settings-export-page',
  imports: [
    TranslateModule,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatCheckbox,
    MatInput
],
  templateUrl: './novel-settings-export-page.component.html',
  styleUrl: './novel-settings-export-page.component.scss',
})
export class NovelSettingsExportPageComponent {
  readonly #novelStore = inject(NovelStore);

  exportForm = new FormGroup({
    separator: new FormControl('* * *'),
    includeSceneTitle: new FormControl(false),
  });

  onSubmit(): void {
    const novel = this.#novelStore.novel();
    if (!novel) {
      return;
    }

    const htmlExporter = new NovelHtmlExporter();
    const content = htmlExporter.exportToHtml(
      novel,
      new NovelHtmlExportOptions(
        this.exportForm.value.separator ?? undefined,
        this.exportForm.value.includeSceneTitle ?? undefined
      )
    );

    const blob = new Blob([content], { type: 'text/html' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `${novel.generalInfo.title}.html`;

    // Append to body (required for Firefox)
    document.body.appendChild(a);

    // Trigger the download
    a.click();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
}
