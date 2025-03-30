import { NovelToCreateDto } from '@owl/shared/novels/contracts';

export class NovelTestBuilder {
  static Default(): NovelToCreateDto {
    return {
      title: 'Novel title',
      description: 'Novel description',
    };
  }
}
