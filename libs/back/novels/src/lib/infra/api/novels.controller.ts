import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { NovelDto } from '@owl/shared/contracts';

import { NovelToCreate } from '../../domain/model';
import { CreateNovelCommand, GetNovelQuery } from '../../domain/ports';
import { novelConverter } from './converter/novel-converter';
import { NovelToCreateDtoImpl } from './dtos/novel-to-create.dto.impl';

@Controller('novels')
export class NovelsController {
  constructor(
    private readonly createNovelCommand: CreateNovelCommand,
    private readonly getNovelQuery: GetNovelQuery
  ) {}

  @Post()
  @Auth()
  async createNovel(
    @Body() novel: NovelToCreateDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const novelToCreate = new NovelToCreate(
      novel.title,
      novel.description,
      request.user.uid
    );
    const id = await this.createNovelCommand.execute(novelToCreate);

    request.res?.location(`/api/novels/${id}`);
  }

  @Get(':id')
  @Auth()
  async getNovel(
    @Req() request: RequestWithUser,
    @Param('id') id: string
  ): Promise<NovelDto> {
    const userId = request.user.uid;
    const novel = await this.getNovelQuery.execute(id, userId);

    if (novel === null) {
      throw new NotFoundException();
    }

    return novelConverter.toNovel(novel);
  }
}
