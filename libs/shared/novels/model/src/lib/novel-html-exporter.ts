import { NovelChapter } from './chapter/novel-chapter';
import { Novel } from './novel';

export class NovelHtmlExportOptions {
  constructor(
    readonly sceneSeparator = '* - *',
    readonly includeSceneTitle = false
  ) {}
}

export class NovelHtmlExporter {
  exportToHtml(novel: Novel, options: NovelHtmlExportOptions): string {
    return `<html>
    <head>
        <title>${novel.generalInfo.title}</title>
        ${this.exportStyles()}
    </head>
    <body>
        ${this.displayFirstPage(novel)}${this.displayChapters(novel, options)}
    </body>
    </html>`;
  }

  private displayFirstPage(novel: Novel): string {
    return `
    <h1>${novel.generalInfo.title}</h1>
    <em style="text-align:center">${novel.participants[0].name}</em>
    ${this.insertPageBreak()}
    `;
  }

  private displayChapters(
    novel: Novel,
    options: NovelHtmlExportOptions
  ): string {
    return novel.chapters
      .map((chapter) => {
        return `
      <h2>${chapter.generalInfo.title}</h2>
      ${this.displayScenes(chapter, options)}
      `;
      })
      .join(this.insertPageBreak());
  }

  private displayScenes(
    chapter: NovelChapter,
    options: NovelHtmlExportOptions
  ): string {
    return chapter.scenes
      .map((scene) => {
        return `${
          options.includeSceneTitle ? `<h3>${scene.generalInfo.title}</h3>` : ''
        }${scene.content}`;
      })
      .join(`<p class="separator">${options.sceneSeparator}</p>`);
  }

  private insertPageBreak(): string {
    return `<div style="page-break-after: always;"></div>`;
  }

  private exportStyles(): string {
    return `
    <style>
        h1 { font-size: 2rem; text-align:center }
        h2 { font-size: 1.5rem; }
        h3 { font-size: 1.2rem; }
        .separator { margin: 1rem 0; }
    </style>`;
  }
}
