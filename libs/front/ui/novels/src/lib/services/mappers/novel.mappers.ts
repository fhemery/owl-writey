import { NovelDto } from '@owl/shared/novels/contracts';

import {
  NovelChaptersViewModel,
  NovelGeneralInfoViewModel,
  NovelParticipantViewModel,
  NovelSceneGeneralInfoViewModel,
  NovelSceneViewModel,
  NovelViewModel,
} from '../../model';

export const novelMappers = {
  novelDtoToViewModel: (dto: NovelDto): NovelViewModel => {
    return new NovelViewModel(
      dto.id,
      new NovelGeneralInfoViewModel(dto.title, dto.description),
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
          new NovelChaptersViewModel(
            chapter.id,
            chapter.title,
            chapter.outline,
            chapter.scenes.map(
              (scene) =>
                new NovelSceneViewModel(
                  scene.id,
                  new NovelSceneGeneralInfoViewModel(
                    scene.title,
                    scene.outline
                  ),
                  scene.content
                )
            )
          )
      )
    );
  },
  novelViewModelToDto: (viewModel: NovelViewModel): NovelDto => {
    return {
      id: viewModel.id,
      title: viewModel.generalInfo.title,
      description: viewModel.generalInfo.description,
      participants: viewModel.participants.map((participant) => ({
        uid: participant.uid,
        name: participant.name,
        role: participant.role,
      })),
      chapters: viewModel.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        outline: chapter.outline,
        scenes: chapter.scenes.map((scene) => ({
          id: scene.id,
          title: scene.generalInfo.title,
          outline: scene.generalInfo.outline,
          content: scene.text,
        })),
      })),
    };
  },
};
