import {
  NovelBuilder,
  NovelCharacterDescriptionUpdatedEvent,
  NovelCharacterDescriptionUpdatedEventData,
  NovelException,
} from '../../lib';

describe('NovelCharacterDescriptionUpdatedEvent', () => {
  const novel = NovelBuilder.New(
    'title',
    'description',
    'authorId',
    'authorName'
  )
    .build()
    .addCharacterAt('character-1', 'Character 1', 'Description')
    .addCharacterAt('character-2', 'Character 2', 'Description');

  describe('error cases', () => {
    it('should fail if there is no id', () => {
      expect(
        () =>
          new NovelCharacterDescriptionUpdatedEvent(
            {
              description: 'New Description',
            } as NovelCharacterDescriptionUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no description', () => {
      expect(
        () =>
          new NovelCharacterDescriptionUpdatedEvent(
            {
              characterId: 'character-1',
            } as NovelCharacterDescriptionUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the character description', () => {
      const event = new NovelCharacterDescriptionUpdatedEvent(
        { characterId: 'character-1', description: 'Updated Description' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].description).toBe(
        'Updated Description'
      );
      expect(updatedNovel.universe.characters[1].description).not.toBe(
        'Updated Description'
      );
    });

    it('should do nothing if character does not exist', () => {
      const event = new NovelCharacterDescriptionUpdatedEvent(
        { characterId: 'non-existent', description: 'Updated Description' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].description).not.toBe(
        'Updated Description'
      );
    });
  });
});
