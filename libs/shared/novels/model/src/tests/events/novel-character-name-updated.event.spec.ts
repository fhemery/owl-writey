import {
  NovelBuilder,
  NovelCharacterNameUpdatedEvent,
  NovelCharacterNameUpdatedEventData,
  NovelException,
} from '../../lib';

describe('NovelCharacterNameUpdatedEvent', () => {
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
          new NovelCharacterNameUpdatedEvent(
            { name: 'New Name' } as NovelCharacterNameUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no name', () => {
      expect(
        () =>
          new NovelCharacterNameUpdatedEvent(
            { id: 'character-1' } as NovelCharacterNameUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if name is empty', () => {
      expect(
        () =>
          new NovelCharacterNameUpdatedEvent(
            {
              id: 'character-1',
              name: '',
            } as NovelCharacterNameUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the character name', () => {
      const event = new NovelCharacterNameUpdatedEvent(
        { id: 'character-1', name: 'Updated Name' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].name).toBe('Updated Name');
      expect(updatedNovel.universe.characters[1].name).not.toBe('Updated Name');
    });

    it('should do nothing if character does not exist', () => {
      const event = new NovelCharacterNameUpdatedEvent(
        { id: 'non-existent', name: 'Updated Name' },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].name).not.toBe('Updated Name');
    });
  });
});
