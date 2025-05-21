import { NovelBuilder, NovelException } from '../../lib';
import { NovelTitleChangedEvent } from '../../lib/events/novel-title-changed-event';

describe('NovelTitleChangedEvent', () => {
  describe('static From', () => {
    it('should create a new event', () => {
      const event = NovelTitleChangedEvent.From({ title: 'new' });
      expect(event).toBeInstanceOf(NovelTitleChangedEvent);
    });

    it('should fail if there is no title', () => {
      expect(() => NovelTitleChangedEvent.From('ab')).toThrowError(
        NovelException
      );
    });
  });

  it('should apply to a novel', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    const event = new NovelTitleChangedEvent('new');

    const newNovel = event.applyTo(novel);
    expect(newNovel.generalInfo.title).toBe('new');
  });

  it('should fail if title is less than three characters long', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    const event = new NovelTitleChangedEvent('ab');
    expect(() => event.applyTo(novel)).toThrowError(
      new NovelException('Title must be at least 3 characters long')
    );
  });
});
