import { NovelBuilder, NovelException } from '../../../lib';
import { NovelTitleChangedEvent } from '../../../lib/events/general-info/novel-title-changed-event';

describe('NovelTitleChangedEvent', () => {
  it('should apply to a novel', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    const event = new NovelTitleChangedEvent({ title: 'new' }, 'uid');

    const newNovel = event.applyTo(novel);
    expect(newNovel.generalInfo.title).toBe('new');
  });

  it('should fail if title is less than three characters long', () => {
    expect(
      () => new NovelTitleChangedEvent({ title: 'ab' }, 'uid')
    ).toThrowError(
      new NovelException('Title must be at least 3 characters long')
    );
  });

  describe('error cases', () => {
    it('should fail if title is empty', () => {
      expect(
        () => new NovelTitleChangedEvent({ title: ' ' }, 'uid')
      ).toThrowError(new NovelException('Title is required'));
    });
  });
});
