import { Novel, NovelBuilder, NovelException, NovelGeneralInfo } from '../lib';

describe('Novel basics', () => {
  it('should create a novel with default parameters', () => {
    const novel = NovelBuilder.New(
      'title',
      'description',
      'authorId',
      'authorName'
    ).build();
    expect(novel.chapters).toBeDefined();
    expect(novel.chapters).toHaveLength(0);
    expect(novel.universe.characters).toHaveLength(0);
    expect(novel.participants).toHaveLength(1);
  });

  it('should throw an error if there is 0 author inside the participants', () => {
    expect(
      () => new Novel('1', new NovelGeneralInfo('title', 'description'))
    ).toThrow(new NovelException('Novel must have at least one author'));
  });
});
