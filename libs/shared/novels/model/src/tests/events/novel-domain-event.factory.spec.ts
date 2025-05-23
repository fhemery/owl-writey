import {
  NovelChapterAddedEvent,
  NovelChapterDeletedEvent,
  NovelChapterMovedEvent,
  NovelChapterOutlineUpdatedEvent,
  NovelChapterTitleUpdatedEvent,
  NovelCharacterAddedEvent,
  NovelCharacterColorUpdatedEvent,
  NovelCharacterDeletedEvent,
  NovelCharacterDescriptionUpdatedEvent,
  NovelCharacterMovedEvent,
  NovelCharacterNameUpdatedEvent,
  NovelCharacterTagsUpdatedEvent,
  NovelDescriptionChangedEvent,
  NovelDomainEventFactory,
  NovelSceneAddedEvent,
  NovelSceneContentUpdatedEvent,
  NovelSceneDeletedEvent,
  NovelSceneMovedEvent,
  NovelSceneOutlineUpdatedEvent,
  NovelScenePovUpdatedEvent,
  NovelSceneTitleUpdatedEvent,
  NovelSceneTransferedEvent,
  NovelTitleChangedEvent,
} from '../../lib';

describe('NovelDomainEventFactory', () => {
  const testCases = [
    {
      name: 'Novel:TitleChanged',
      data: { title: 'New Title' },
      expectedType: NovelTitleChangedEvent,
      version: '1',
    },
    {
      name: 'Novel:DescriptionChanged',
      data: { description: 'New Description' },
      expectedType: NovelDescriptionChangedEvent,
      version: '1',
    },
    {
      name: 'Novel:ChapterAdded',
      data: { id: '1', name: 'Chapter 1', outline: '', at: 0 },
      expectedType: NovelChapterAddedEvent,
      version: '1',
    },
    {
      name: 'Novel:ChapterDeleted',
      data: { id: '1' },
      expectedType: NovelChapterDeletedEvent,
      version: '1',
    },
    {
      name: 'Novel:ChapterMoved',
      data: { id: '1', atIndex: 1 },
      expectedType: NovelChapterMovedEvent,
      version: '1',
    },
    {
      name: 'Novel:ChapterTitleUpdated',
      data: { id: '1', title: 'Updated Title' },
      expectedType: NovelChapterTitleUpdatedEvent,
      version: '1',
    },
    {
      name: 'NovelChapterOutlineUpdated',
      data: { id: '1', outline: 'Updated Outline' },
      expectedType: NovelChapterOutlineUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneAdded',
      data: { chapterId: '1', sceneId: 's1', title: 'New Scene', at: 0 },
      expectedType: NovelSceneAddedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneDeleted',
      data: { chapterId: '1', sceneId: 's1' },
      expectedType: NovelSceneDeletedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneMoved',
      data: { chapterId: '1', sceneId: 's1', at: 1 },
      expectedType: NovelSceneMovedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneTransfered',
      data: {
        initialChapterId: '1',
        sceneId: 's1',
        targetChapterId: '2',
        at: 0,
      },
      expectedType: NovelSceneTransferedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneTitleUpdated',
      data: { chapterId: '1', sceneId: 's1', title: 'Updated Title' },
      expectedType: NovelSceneTitleUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneOutlineUpdated',
      data: { chapterId: '1', sceneId: 's1', outline: 'Updated Outline' },
      expectedType: NovelSceneOutlineUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:ScenePovUpdated',
      data: { chapterId: '1', sceneId: 's1', povId: 'char1' },
      expectedType: NovelScenePovUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:SceneContentUpdated',
      data: { chapterId: '1', sceneId: 's1', content: 'New content' },
      expectedType: NovelSceneContentUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterAdded',
      data: {
        characterId: 'char1',
        name: 'New Character',
        description: 'New description',
        at: 0,
      },
      expectedType: NovelCharacterAddedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterDeleted',
      data: { characterId: 'char1' },
      expectedType: NovelCharacterDeletedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterMoved',
      data: { characterId: 'char1', toIndex: 1 },
      expectedType: NovelCharacterMovedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterNameUpdated',
      data: { id: 'char1', name: 'Updated Name' },
      expectedType: NovelCharacterNameUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterDescriptionUpdated',
      data: { characterId: 'char1', description: 'New description' },
      expectedType: NovelCharacterDescriptionUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterColorUpdated',
      data: { characterId: 'char1', color: '#ff0000' },
      expectedType: NovelCharacterColorUpdatedEvent,
      version: '1',
    },
    {
      name: 'Novel:CharacterTagsUpdated',
      data: { characterId: 'char1', tags: ['protagonist', 'hero'] },
      expectedType: NovelCharacterTagsUpdatedEvent,
      version: '1',
    },
  ];

  it.each(testCases)(
    'should create $name event',
    ({ name, data, expectedType, version }) => {
      const event = NovelDomainEventFactory.From(
        name,
        version,
        data,
        'test-user',
        'test-event-id',
        1
      );

      expect(event).toBeInstanceOf(expectedType);
      expect(event.eventName).toBe(name);
      expect(event.eventVersion).toBe(version);
      expect(event.userId).toBe('test-user');
      expect(event.eventId).toBe('test-event-id');
      expect(event.eventSequentialId).toBe(1);
    }
  );

  it('should throw for unknown event types', () => {
    expect(() => {
      NovelDomainEventFactory.From('UnknownEvent', '1', {}, 'test-user');
    }).toThrow(Error);
  });
});
