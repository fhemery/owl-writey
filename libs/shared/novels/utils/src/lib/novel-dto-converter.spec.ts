import {
  ChapterDto,
  ChapterGeneralInfoDto,
  NovelCharacterDto,
  NovelDto,
  NovelGeneralInfoDto,
  NovelParticipantDto,
  NovelRole,
  NovelUniverseDto,
  SceneDto,
  SceneGeneralInfoDto,
} from '@owl/shared/novels/contracts';
import {
  Novel,
  NovelBuilder,
  NovelChapter,
  NovelChapterGeneralInfo,
  NovelCharacter,
  NovelScene,
  NovelSceneGeneralInfo,
  NovelUniverse,
} from '@owl/shared/novels/model';

import { toNovel, toNovelDto } from './novel-dto-converters';

describe('Novel DTO Converters', () => {
  describe('toNovelDto', () => {
    it('should convert a Novel to a NovelDto', () => {
      // Arrange
      const authorId = 'author-id';
      const authorName = 'Author Name';
      const novel = NovelBuilder.New(
        'Test Novel',
        'A test novel description',
        authorId,
        authorName
      ).build();

      // Act
      const novelDto = toNovelDto(novel);

      // Assert
      expect(novelDto).toBeDefined();
      expect(novelDto.id).toBe(novel.id);
      expect(novelDto.generalInfo.title).toBe('Test Novel');
      expect(novelDto.generalInfo.description).toBe('A test novel description');
      expect(novelDto.participants).toHaveLength(1);
      expect(novelDto.participants[0].uid).toBe(authorId);
      expect(novelDto.participants[0].name).toBe(authorName);
      expect(novelDto.participants[0].role).toBe(NovelRole.Author);
      expect(novelDto.chapters).toHaveLength(0);
      expect(novelDto.universe).toBeDefined();
    });

    it('should convert a complex Novel with chapters, scenes and characters to a NovelDto', () => {
      // Arrange
      const authorId = 'author-id';
      const authorName = 'Author Name';
      const novel = createComplexNovel(authorId, authorName);

      // Act
      const novelDto = toNovelDto(novel);

      // Assert
      expect(novelDto).toBeDefined();
      expect(novelDto.id).toBe(novel.id);
      expect(novelDto.generalInfo.title).toBe('Complex Novel');
      expect(novelDto.generalInfo.description).toBe(
        'A complex novel description'
      );
      expect(novelDto.participants).toHaveLength(1);
      expect(novelDto.chapters).toHaveLength(2);
      expect(novelDto.chapters[0].scenes).toHaveLength(2);
      expect(novelDto.chapters[0].scenes[1].generalInfo.pointOfViewId).toBe(
        'character-1'
      );
      expect(novelDto.chapters[1].scenes).toHaveLength(1);
      expect(novelDto.universe?.characters).toHaveLength(2);
      expect(novelDto.universe?.characters[0].properties.color).toBe('red');
    });
  });

  describe('toNovel', () => {
    it('should convert a NovelDto to a Novel', () => {
      // Arrange
      const novelDto = createBasicNovelDto();

      // Act
      const novel = toNovel(novelDto);

      // Assert
      expect(novel).toBeDefined();
      expect(novel.id).toBe(novelDto.id);
      expect(novel.generalInfo.title).toBe('Test Novel');
      expect(novel.generalInfo.description).toBe('A test novel description');
      expect(novel.participants).toHaveLength(1);
      expect(novel.participants[0].uid).toBe('author-id');
      expect(novel.participants[0].name).toBe('Author Name');
      expect(novel.participants[0].role).toBe(NovelRole.Author);
      expect(novel.chapters).toHaveLength(0);
      expect(novel.universe).toBeDefined();
    });

    it('should convert a complex NovelDto with chapters, scenes and characters to a Novel', () => {
      // Arrange
      const novelDto = createComplexNovelDto();

      // Act
      const novel = toNovel(novelDto);

      // Assert
      expect(novel).toBeDefined();
      expect(novel.id).toBe(novelDto.id);
      expect(novel.generalInfo.title).toBe('Complex Novel');
      expect(novel.generalInfo.description).toBe('A complex novel description');
      expect(novel.participants).toHaveLength(1);
      expect(novel.chapters).toHaveLength(2);
      expect(novel.chapters[0].scenes).toHaveLength(2);
      expect(novel.chapters[0].scenes[1].generalInfo.pov).toBe('character-1');
      expect(novel.chapters[1].scenes).toHaveLength(1);
      expect(novel.universe.characters).toHaveLength(2);
      expect(novel.universe.characters[0].properties.color).toBe('red');
    });

    it('should handle a NovelDto without a universe', () => {
      // Arrange
      const novelDto = createBasicNovelDto();
      delete novelDto.universe;

      // Act
      const novel = toNovel(novelDto);

      // Assert
      expect(novel).toBeDefined();
      expect(novel.universe).toBeDefined();
      expect(novel.universe.characters).toHaveLength(0);
    });
  });

  describe('Roundtrip conversion', () => {
    it('should maintain data integrity when converting from Novel to NovelDto and back', () => {
      const originalNovelDto = createComplexNovelDto();

      // Act
      const convertedNovel = toNovel(originalNovelDto);
      const convertedNovelDto = toNovelDto(convertedNovel);

      expect(originalNovelDto).toEqual(convertedNovelDto);
    });
  });
});

// Helper functions to create test data
function createBasicNovelDto(): NovelDto {
  return {
    id: 'novel-id',
    generalInfo: {
      title: 'Test Novel',
      description: 'A test novel description',
    },
    participants: [
      {
        uid: 'author-id',
        name: 'Author Name',
        role: NovelRole.Author,
      },
    ],
    chapters: [],
    universe: {
      characters: [],
    },
  };
}

function createComplexNovelDto(): NovelDto {
  const generalInfo: NovelGeneralInfoDto = {
    title: 'Complex Novel',
    description: 'A complex novel description',
  };

  const participants: NovelParticipantDto[] = [
    {
      uid: 'author-id',
      name: 'Author Name',
      role: NovelRole.Author,
    },
  ];

  const scene1GeneralInfo: SceneGeneralInfoDto = {
    title: 'Scene 1',
    outline: 'Scene 1 outline',
  };

  const scene2GeneralInfo: SceneGeneralInfoDto = {
    title: 'Scene 2',
    outline: 'Scene 2 outline',
    pointOfViewId: 'character-1',
  };

  const scene3GeneralInfo: SceneGeneralInfoDto = {
    title: 'Scene 3',
    outline: 'Scene 3 outline',
  };

  const scene1: SceneDto = {
    id: 'scene-1',
    generalInfo: scene1GeneralInfo,
    content: 'Scene 1 content',
  };

  const scene2: SceneDto = {
    id: 'scene-2',
    generalInfo: scene2GeneralInfo,
    content: 'Scene 2 content',
  };

  const scene3: SceneDto = {
    id: 'scene-3',
    generalInfo: scene3GeneralInfo,
    content: 'Scene 3 content',
  };

  const chapter1GeneralInfo: ChapterGeneralInfoDto = {
    title: 'Chapter 1',
    outline: 'Chapter 1 outline',
  };

  const chapter2GeneralInfo: ChapterGeneralInfoDto = {
    title: 'Chapter 2',
    outline: 'Chapter 2 outline',
  };

  const chapter1: ChapterDto = {
    id: 'chapter-1',
    generalInfo: chapter1GeneralInfo,
    scenes: [scene1, scene2],
  };

  const chapter2: ChapterDto = {
    id: 'chapter-2',
    generalInfo: chapter2GeneralInfo,
    scenes: [scene3],
  };

  const character1: NovelCharacterDto = {
    id: 'character-1',
    name: 'Character 1',
    description: 'Character 1 description',
    tags: ['protagonist'],
    properties: { color: 'red' },
  };

  const character2: NovelCharacterDto = {
    id: 'character-2',
    name: 'Character 2',
    description: 'Character 2 description',
    tags: ['antagonist'],
    properties: {},
  };

  const universe: NovelUniverseDto = {
    characters: [character1, character2],
  };

  return {
    id: 'novel-id',
    generalInfo,
    participants,
    chapters: [chapter1, chapter2],
    universe,
  };
}

function createComplexNovel(authorId: string, authorName: string): Novel {
  const builder = NovelBuilder.New(
    'Complex Novel',
    'A complex novel description',
    authorId,
    authorName
  );

  // Create chapters and scenes
  const chapter1 = new NovelChapter(
    'chapter-1',
    new NovelChapterGeneralInfo('Chapter 1', 'Chapter 1 outline'),
    [
      new NovelScene(
        'scene-1',
        new NovelSceneGeneralInfo('Scene 1', 'Scene 1 outline'),
        'Scene 1 content'
      ),
      new NovelScene(
        'scene-2',
        new NovelSceneGeneralInfo('Scene 2', 'Scene 2 outline', 'character-1'),
        'Scene 2 content'
      ),
    ]
  );

  const chapter2 = new NovelChapter(
    'chapter-2',
    new NovelChapterGeneralInfo('Chapter 2', 'Chapter 2 outline'),
    [
      new NovelScene(
        'scene-3',
        new NovelSceneGeneralInfo('Scene 3', 'Scene 3 outline'),
        'Scene 3 content'
      ),
    ]
  );

  // Create characters
  const character1 = new NovelCharacter(
    'character-1',
    'Character 1',
    'Character 1 description',
    ['protagonist'],
    { color: 'red' }
  );

  const character2 = new NovelCharacter(
    'character-2',
    'Character 2',
    'Character 2 description',
    ['antagonist']
  );

  const universe = new NovelUniverse([character1, character2]);

  return builder
    .withChapters([chapter1, chapter2])
    .withUniverse(universe)
    .build();
}
