import {
  NovelBuilder,
  NovelDescriptionChangedEvent,
  NovelDescriptionChangedEventData,
  NovelException,
} from '../../../lib';

describe('NovelDescriptionChangedEvent', () => {
  it('should apply to a novel', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    const event = new NovelDescriptionChangedEvent(
      { description: 'new' },
      'uid'
    );

    const newNovel = event.applyTo(novel);
    expect(newNovel.generalInfo.description).toBe('new');
  });

  describe('error cases', () => {
    it('should fail if description is not provided', () => {
      expect(
        () =>
          new NovelDescriptionChangedEvent(
            {} as NovelDescriptionChangedEventData,
            'uid'
          )
      ).toThrowError(new NovelException('Description is required'));
    });
  });
});
