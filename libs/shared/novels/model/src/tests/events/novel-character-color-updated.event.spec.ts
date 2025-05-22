import {
  NovelBuilder,
  NovelCharacterColorUpdatedEvent,
  NovelCharacterColorUpdatedEventData,
  NovelException,
} from '../../lib';

describe('NovelCharacterColorUpdatedEvent', () => {
  const novel = NovelBuilder.New(
    'title',
    'description',
    'authorId',
    'authorName'
  )
    .build()
    .addCharacterAt('character-1', 'Character 1', 'Description')
    .addCharacterAt('character-2', 'Character 2', 'Description');

  describe('static From', () => {
    it('should create a new event', () => {
      const event = NovelCharacterColorUpdatedEvent.From(
        { characterId: 'character-1', color: 'New Color' },
        'userId'
      );
      expect(event).toBeInstanceOf(NovelCharacterColorUpdatedEvent);
      expect(event.data.characterId).toBe('character-1');
      expect(event.data.color).toBe('New Color');
    });
  });

  describe('error cases', () => {
    it('should fail if there is no id', () => {
      expect(
        () =>
          new NovelCharacterColorUpdatedEvent(
            { color: 'New Color' } as NovelCharacterColorUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the character color', () => {
      const event = new NovelCharacterColorUpdatedEvent(
        { characterId: 'character-1', color: 'New Color' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].properties.color).toBe(
        'New Color'
      );
      expect(updatedNovel.universe.characters[1].properties.color).not.toBe(
        'New Color'
      );
    });

    it('should work to reset a color', () => {
      const newNovel = novel.updateCharacter(
        novel.universe.characters[0].withColor('New Color')
      );

      const event = new NovelCharacterColorUpdatedEvent(
        { characterId: 'character-1', color: undefined },
        'userId'
      );

      const updatedNovel = event.applyTo(newNovel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(
        updatedNovel.universe.characters[0].properties.color
      ).toBeUndefined();
    });

    it('should do nothing if character does not exist', () => {
      const event = new NovelCharacterColorUpdatedEvent(
        { characterId: 'non-existent', color: 'New Color' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].properties.color).not.toBe(
        'New Color'
      );
    });
  });
});
