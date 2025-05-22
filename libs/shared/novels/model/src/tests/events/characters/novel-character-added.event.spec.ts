import {
  NovelBuilder,
  NovelCharacterAddedEvent,
  NovelCharacterAddedEventData,
  NovelException,
} from '../../../lib';

const basicNovel = NovelBuilder.New(
  'title',
  'description',
  'authorId',
  'authorName'
).build();

describe('NovelCharacterAddedEvent', () => {
  describe('applyTo', () => {
    it('should add the character at provided index', () => {
      const event = new NovelCharacterAddedEvent(
        { characterId: '1', name: 'bob', description: 'description', at: 0 },
        'userId'
      );

      const newNovel = event.applyTo(basicNovel);
      expect(newNovel.universe.characters.length).toBe(1);
      expect(newNovel.universe.characters[0].name).toBe('bob');
      expect(newNovel.universe.characters[0].description).toBe('description');
    });

    it('should place character at the end if at is too big', () => {
      const novel = basicNovel.addCharacterAt('1', 'character', 'description');

      const event = new NovelCharacterAddedEvent(
        { characterId: '2', name: 'bob', description: 'description', at: 2 },
        'userId'
      );
      const newNovel = event.applyTo(novel);
      expect(newNovel.universe.characters[1].name).toBe('bob');
    });

    it('should place character at the beginning if at is negative', () => {
      const novel = basicNovel.addCharacterAt('1', 'character', 'description');

      const event = new NovelCharacterAddedEvent(
        { characterId: '2', name: 'bob', description: 'description', at: -1 },
        'userId'
      );
      const newNovel = event.applyTo(novel);
      expect(newNovel.universe.characters[0].name).toBe('bob');
    });

    describe('errorCases', () => {
      it('should fail if id is not provided', () => {
        expect(
          () =>
            new NovelCharacterAddedEvent(
              {
                name: 'bob',
                description: 'description',
                at: 0,
              } as NovelCharacterAddedEventData,
              'userId'
            )
        ).toThrowError(NovelException);
      });

      it('should fail if id is empty', () => {
        expect(
          () =>
            new NovelCharacterAddedEvent(
              {
                characterId: '',
                name: 'new',
                description: 'description',
                at: 0,
              },
              'userId'
            )
        ).toThrowError(NovelException);
      });

      it('should fail if name is not d', () => {
        expect(
          () =>
            new NovelCharacterAddedEvent(
              {
                characterId: '1',
                description: 'description',
              } as NovelCharacterAddedEventData,
              'userId'
            )
        ).toThrowError(NovelException);
      });

      it('should fail if name is empty', () => {
        expect(
          () =>
            new NovelCharacterAddedEvent(
              {
                characterId: '1',
                name: ' ',
                description: 'description',
                at: 0,
              },
              'userId'
            )
        ).toThrowError(NovelException);
      });

      it('should fail if description is not provided', () => {
        expect(
          () =>
            new NovelCharacterAddedEvent(
              {
                characterId: '1',
                name: 'new',
              } as NovelCharacterAddedEventData,
              'userId'
            )
        ).toThrowError(NovelException);
      });
    });
  });
});
