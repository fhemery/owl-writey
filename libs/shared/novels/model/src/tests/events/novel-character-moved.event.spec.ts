import {
  NovelBuilder,
  NovelCharacterMovedEvent,
  NovelCharacterMovedEventData,
  NovelException,
} from '../../lib';

const basicNovel = NovelBuilder.New(
  'title',
  'description',
  'authorId',
  'authorName'
).build();
describe('NovelChacterMovedEvent', () => {
  describe('applyTo', () => {
    it('should move character forward properly', () => {
      const novel = basicNovel
        .addCharacterAt('1', 'character1', 'outline1')
        .addCharacterAt('2', 'character2', 'outline2')
        .addCharacterAt('3', 'character3', 'outline3');

      const event = new NovelCharacterMovedEvent(
        { characterId: '1', toIndex: 2 },
        'uid'
      );
      const result = event.applyTo(novel);

      const characterIds = result.universe.characters.map((c) => c.id);
      expect(characterIds).toEqual(['2', '1', '3']);
    });

    it('should move chapter backward properly', () => {
      const novel = basicNovel
        .addCharacterAt('1', 'character1', 'outline1')
        .addCharacterAt('2', 'character2', 'outline2')
        .addCharacterAt('3', 'character3', 'outline3');

      const event = new NovelCharacterMovedEvent(
        { characterId: '2', toIndex: 0 },
        'uid'
      );
      const result = event.applyTo(novel);

      const characterIds = result.universe.characters.map((c) => c.id);
      expect(characterIds).toEqual(['2', '1', '3']);
    });

    it('should not throw if chapter is not found', () => {
      const novel = basicNovel.addCharacterAt('1', 'character1', 'outline1');

      const event = new NovelCharacterMovedEvent(
        { characterId: 'non-existing', toIndex: 1 },
        'uid'
      );

      expect(() => event.applyTo(novel)).not.toThrowError();
    });
  });

  describe('error cases', () => {
    it('should throw an error if characterId is not provided', () => {
      expect(
        () =>
          new NovelCharacterMovedEvent(
            { toIndex: 1 } as NovelCharacterMovedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });
    it('should throw an error if toIndex is not provided', () => {
      expect(
        () =>
          new NovelCharacterMovedEvent(
            { characterId: '1' } as NovelCharacterMovedEventData,
            'uid'
          )
      ).toThrowError(NovelException);
    });

    it('should throw an error if toIndex is negative', () => {
      expect(
        () =>
          new NovelCharacterMovedEvent({ characterId: '1', toIndex: -1 }, 'uid')
      ).toThrowError(NovelException);
    });
  });
});
