import { NovelDto } from '@owl/shared/novels/contracts';

import {
  NovelChapterGeneralInfoViewModel,
  NovelChapterViewModel,
  NovelCharacterViewModel,
  NovelGeneralInfoViewModel,
  NovelParticipantViewModel,
  NovelSceneGeneralInfoViewModel,
  NovelSceneViewModel,
  NovelUniverseViewModel,
  NovelViewModel,
} from '../../model';

export const novelMappers = {
  novelDtoToViewModel: (dto: NovelDto): NovelViewModel => {
    return new NovelViewModel(
      dto.id,
      new NovelGeneralInfoViewModel(
        dto.generalInfo.title,
        dto.generalInfo.description
      ),
      dto.participants.map(
        (participant) =>
          new NovelParticipantViewModel(
            participant.uid,
            participant.name,
            participant.role
          )
      ),
      dto.chapters.map(
        (chapter) =>
          new NovelChapterViewModel(
            chapter.id,
            new NovelChapterGeneralInfoViewModel(
              chapter.generalInfo.title,
              chapter.generalInfo.outline
            ),
            chapter.scenes.map(
              (scene) =>
                new NovelSceneViewModel(
                  scene.id,
                  new NovelSceneGeneralInfoViewModel(
                    scene.generalInfo.title,
                    scene.generalInfo.outline
                  ),
                  scene.content
                )
            )
          )
      ),
      new NovelUniverseViewModel(
        dto.universe?.characters.map(
          (character) =>
            new NovelCharacterViewModel(
              character.id,
              character.name,
              character.description,
              character.tags
            )
        ) || []
      )
    );
  },
  novelViewModelToDto: (viewModel: NovelViewModel): NovelDto => {
    return {
      id: viewModel.id,
      generalInfo: {
        title: viewModel.generalInfo.title,
        description: viewModel.generalInfo.description,
      },
      participants: viewModel.participants.map((participant) => ({
        uid: participant.uid,
        name: participant.name,
        role: participant.role,
      })),
      chapters: viewModel.chapters.map((chapter) => ({
        id: chapter.id,
        generalInfo: {
          title: chapter.generalInfo.title,
          outline: chapter.generalInfo.outline,
        },
        scenes: chapter.scenes.map((scene) => ({
          id: scene.id,
          generalInfo: {
            title: scene.generalInfo.title,
            outline: scene.generalInfo.outline,
          },
          content: scene.text,
        })),
      })),
      universe: {
        characters:
          viewModel.universe?.characters.map((character) => ({
            id: character.id,
            name: character.name,
            description: character.description,
            tags: character.tags,
          })) || [],
      },
    };
  },
};
