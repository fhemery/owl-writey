import { applyTextDiff, generateTextDiff } from './diff-utils';

describe('diff-utils', () => {
  describe('patch generation and application', () => {
    it.each([
      {
        old: 'Hello world',
        new: 'Hello universe',
        desc: 'Simple replace',
        wordsDiff: 0,
      },
      {
        old: 'Hello world',
        new: 'Hello world!',
        desc: 'Simple punctuation addition',
        wordsDiff: 0,
      },
      {
        old: 'Hello world',
        new: 'Hello beautiful world',
        desc: 'Simple word addition',
        wordsDiff: 1,
      },
      {
        old: 'Hello world!',
        new: 'Hello world',
        desc: 'Simple punctuation removal',
        wordsDiff: 0,
      },
      {
        old: 'Hello beautiful world!',
        new: 'Hello world!',
        desc: 'Simple word removal',
        wordsDiff: -1,
      },
      {
        old: 'Hello world',
        new: 'Hello world',
        desc: 'No change',
        wordsDiff: 0,
      },
      {
        old: '<p>Hello world</p>',
        new: '<p>Hello <strong>universe</strong></p>',
        desc: 'Simple replace with HTML',
        wordsDiff: 0,
      },
      {
        old: "<p>Let's create <strong>a mess</strong></p>",
        new: '<p>Hello <strong>hell of a </strong>mess</p>',
        desc: 'Harder replace',
        wordsDiff: 0,
      },
    ])(
      'should generate and apply diffs and compute correctly word count $desc',
      ({ old, new: newText, wordsDiff }) => {
        const diff = generateTextDiff(old, newText);

        const wordCount = diff.stats.diffWordCount;
        expect(wordCount).toBe(wordsDiff);

        const appliedText = applyTextDiff(old, diff);
        expect(appliedText).toBe(newText);
      }
    );
  });
});
