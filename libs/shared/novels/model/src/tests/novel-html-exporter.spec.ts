import {
  Novel,
  NovelBuilder,
  NovelHtmlExporter,
  NovelHtmlExportOptions,
} from '../lib';

describe('NovelHtmlExporter', () => {
  let exporter: NovelHtmlExporter;
  let novel: Novel;

  beforeEach(() => {
    exporter = new NovelHtmlExporter();
    novel = generateNovel();
  });

  it('should export title to a h1 and set it as the title', () => {
    const html = exporter.exportToHtml(novel, new NovelHtmlExportOptions());
    expectHtmlToContain(html, '<h1>Novel title</h1>');
    expectHtmlToContain(html, '<title>Novel title</title>');
  });

  it('should add the authorName after the title', () => {
    const html = exporter.exportToHtml(novel, new NovelHtmlExportOptions());
    expectHtmlToContain(html, '<em style="text-align:center">authorName</em>');
  });

  it('should add a page break after the author name', () => {
    const html = exporter.exportToHtml(novel, new NovelHtmlExportOptions());
    expectHtmlToContain(
      html,
      `<em style="text-align:center">authorName</em><div style="page-break-after: always;"></div>`
    );
  });

  it('should export any chapter title as a h2', () => {
    const html = exporter.exportToHtml(novel, new NovelHtmlExportOptions());
    expectHtmlToContain(html, '<h2>Chapter 1</h2>');
  });

  it('should insert a page break in between each chapter', () => {
    const html = exporter.exportToHtml(novel, new NovelHtmlExportOptions());
    expectHtmlToContain(
      html,
      '<div style="page-break-after: always;"></div><h2>Chapter 2</h2>'
    );
  });

  it('should append scene content along with its HTML tags', () => {
    const html = exporter.exportToHtml(
      generateNovel(),
      new NovelHtmlExportOptions()
    );
    expectHtmlToContain(html, 'Scene 1 content');
    expectHtmlToContain(html, '<p>Scene 2 content</p>');
  });

  it('should use the provided separator to insert between scenes', () => {
    const html = exporter.exportToHtml(
      generateNovel(),
      new NovelHtmlExportOptions('~~~')
    );
    expectHtmlToContain(html, 'Scene 1 content<p class="separator">~~~</p>');
  });

  it('should not display scene title if includeSceneTitle is false', () => {
    const html = exporter.exportToHtml(
      generateNovel(),
      new NovelHtmlExportOptions()
    );
    expect(html).not.toContain('Scene 1 Title');
    expect(html).not.toContain('Scene 2 Title');
  });

  it('should display scene title if includeSceneTitle is true', () => {
    const html = exporter.exportToHtml(
      generateNovel(),
      new NovelHtmlExportOptions(undefined, true)
    );
    expect(html).toContain('<h3>Scene 1 Title</h3>');
    expect(html).toContain('<h3>Scene 2 Title</h3>');
  });
});

function expectHtmlToContain(html: string, content: string): void {
  expect(normalizeHtml(html)).toContain(normalizeHtml(content));
}

function normalizeHtml(html: string): string {
  return html.replace(/\s+/g, '');
}

function generateNovel(): Novel {
  const novel = NovelBuilder.New(
    'Novel title',
    'Novel outline',
    'authorId',
    'authorName'
  )
    .build()
    .addChapterAt('chap-1', 'Chapter 1', 'Chapter 1 outline')
    .addSceneAt('chap-1', 'scene-1', 'Scene 1 Title', 'Scene 1 outline')
    .addSceneAt('chap-1', 'scene-2', 'Scene 2 Title', 'Scene 2 outline')
    .addChapterAt('chap-2', 'Chapter 2', 'Chapter 2 outline');

  const scene1 = novel.findScene('chap-1', 'scene-1');
  const scene2 = novel.findScene('chap-1', 'scene-2');
  if (!scene1 || !scene2) {
    expect.fail('Scenes not found');
  }

  return novel
    .updateScene('chap-1', scene1.withContent('Scene 1 content'))
    .updateScene('chap-1', scene2.withContent('<p>Scene 2 content</p>'));
}
