import { NovelDto } from '@owl/shared/contracts';

import { NovelGeneralInfoViewModel, NovelViewModel } from '../../../../model';

export const novelMappers = {
  novelDtoToViewModel: (dto: NovelDto): NovelViewModel => {
    return new NovelViewModel(
      dto.id,
      new NovelGeneralInfoViewModel(dto.title, dto.description)
    );
  },
};
