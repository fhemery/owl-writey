import {
  NovelBuilder,
  NovelCharacterTagsUpdatedEvent,
  NovelCharacterTagsUpdatedEventData,
  NovelException,
} from '../../lib';

describe('NovelCharacterTagsUpdatedEvent', () => {
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
          new NovelCharacterTagsUpdatedEvent(
            {
              tags: ['tag-1', 'tag-2'],
            } as NovelCharacterTagsUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if there is no tags', () => {
      expect(
        () =>
          new NovelCharacterTagsUpdatedEvent(
            {
              characterId: 'character-1',
            } as NovelCharacterTagsUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });

    it('should fail if tags is not an array', () => {
      expect(
        () =>
          new NovelCharacterTagsUpdatedEvent(
            {
              characterId: 'character-1',
              tags: 'not an array' as unknown as string[],
            } as NovelCharacterTagsUpdatedEventData,
            'userId'
          )
      ).toThrowError(NovelException);
    });
  });

  describe('applyTo', () => {
    it('should update the character tags', () => {
      const event = new NovelCharacterTagsUpdatedEvent(
        { characterId: 'character-1', tags: ['tag-1', 'tag-2'] },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].tags).toEqual([
        'tag-1',
        'tag-2',
      ]);
      expect(updatedNovel.universe.characters[1].tags).not.toEqual([
        'tag-1',
        'tag-2',
      ]);
    });

    it('should do nothing if character does not exist', () => {
      const event = new NovelCharacterTagsUpdatedEvent(
        { characterId: 'non-existent', tags: ['tag-1', 'tag-2'] },
        'userId'
      );

      const updatedNovel = event.applyTo(novel);

      expect(updatedNovel.universe.characters.length).toBe(2);
      expect(updatedNovel.universe.characters[0].tags).not.toEqual([
        'tag-1',
        'tag-2',
      ]);
    });
  });
});
