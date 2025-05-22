import {
  NovelBuilder,
  NovelCharacterDeletedEvent,
  NovelCharacterDeletedEventData,
  NovelException,
} from '../../lib';

const basicNovel = NovelBuilder.New(
  'title',
  'description',
  'authorId',
  'authorName'
).build();

describe('NovelCharacterDeletedEvent', () => {
  describe('applyTo', () => {
    it('should delete the character', () => {
      const novel = basicNovel
        .addCharacterAt('1', 'character', 'description')
        .addCharacterAt('2', 'character2', 'description2');
      const event = new NovelCharacterDeletedEvent(
        { characterId: '1' },
        'userId'
      );

      const newNovel = event.applyTo(novel);
      expect(newNovel.universe.characters.map((c) => c.id)).toEqual(['2']);
    });

    it('should remove any scene using the character point of view', () => {
      const novel = basicNovel
        .addCharacterAt('character-1-id', 'character', 'description')
        .addCharacterAt('character-2-id', 'character2', 'description2')
        .addChapterAt('chapter-1-id', 'chapter', 'outline')
        .addSceneAt('chapter-1-id', 'scene-1-id', 'scene', 'outline');

      const event = new NovelCharacterDeletedEvent(
        { characterId: 'character-1-id' },
        'userId'
      );

      const newNovel = event.applyTo(novel);
      expect(newNovel.universe.characters.map((c) => c.id)).toEqual([
        'character-2-id',
      ]);
      expect(
        newNovel.findScene('chapter-1-id', 'scene-1-id')?.generalInfo.pov
      ).toBeUndefined();
    });

    it('should not fail if character is not found', () => {
      const novel = basicNovel.addCharacterAt('1', 'character', 'description');

      const event = new NovelCharacterDeletedEvent(
        { characterId: '2' },
        'userId'
      );
      const newNovel = event.applyTo(novel);
      expect(newNovel.universe.characters.map((c) => c.id)).toEqual(['1']);
    });

    describe('errorCases', () => {
      it('should fail if id is not provided', () => {
        expect(
          () =>
            new NovelCharacterDeletedEvent(
              {} as NovelCharacterDeletedEventData,
              'userId'
            )
        ).toThrowError(NovelException);
      });
    });
  });
});
