import {
  NovelBuilder,
  NovelDescriptionChangedEvent,
  NovelException,
} from '../../lib';

describe('NovelDescriptionChangedEvent', () => {
  describe('static From', () => {
    it('should create a new event', () => {
      const event = NovelDescriptionChangedEvent.From(
        { description: 'new' },
        'uid'
      );
      expect(event).toBeInstanceOf(NovelDescriptionChangedEvent);
      expect(event.data.description).toBe('new');
    });

    it('should fail if there is no description', () => {
      expect(() => NovelDescriptionChangedEvent.From('ab', 'uid')).toThrowError(
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
    const event = new NovelDescriptionChangedEvent('new', 'uid');

    const newNovel = event.applyTo(novel);
    expect(newNovel.generalInfo.description).toBe('new');
  });
});
