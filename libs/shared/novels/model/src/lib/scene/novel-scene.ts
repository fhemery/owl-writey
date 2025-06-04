import { countWordsFromHtml } from '@owl/shared/word-utils';

import { NovelSceneGeneralInfo } from './novel-scene-general-info';

export class NovelScene {
  readonly nbWords: number;
  constructor(
    readonly id: string,
    readonly generalInfo: NovelSceneGeneralInfo,
    readonly content: string
  ) {
    this.nbWords = countWordsFromHtml(content);
  }

  removePov(id: string): NovelScene {
    if (this.generalInfo.pov !== id) {
      return this;
    }
    return this.withGeneralInfo(this.generalInfo.withPov(undefined));
  }

  withTitle(title: string): NovelScene {
    return this.withGeneralInfo(this.generalInfo.withTitle(title));
  }

  withOutline(outline: string): NovelScene {
    return this.withGeneralInfo(this.generalInfo.withOutline(outline));
  }

  withPov(povId?: string): NovelScene {
    return this.withGeneralInfo(this.generalInfo.withPov(povId));
  }

  withContent(content: string): NovelScene {
    return new NovelScene(this.id, this.generalInfo, content);
  }

  private withGeneralInfo(generalInfo: NovelSceneGeneralInfo): NovelScene {
    return new NovelScene(this.id, generalInfo, this.content);
  }
}
