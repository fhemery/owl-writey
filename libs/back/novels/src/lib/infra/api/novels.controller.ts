import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { GetAllNovelsResponseDto, NovelDto } from '@owl/shared/contracts';

import { NovelToCreate } from '../../domain/model';
import {
  CreateNovelCommand,
  DeleteAllNovelsCommand,
  GetAllNovelsQuery,
  GetNovelQuery,
} from '../../domain/ports';
import { novelConverter } from './converter/novel-converter';
import { NovelToCreateDtoImpl } from './dtos/novel-to-create.dto.impl';

@Controller('novels')
@ApiBearerAuth()
export class NovelsController {
  constructor(
    private readonly createNovelCommand: CreateNovelCommand,
    private readonly getNovelQuery: GetNovelQuery,
    private readonly getAllNovelsQuery: GetAllNovelsQuery,
    private readonly deleteNovelsCommand: DeleteAllNovelsCommand
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

  @Get()
  @Auth()
  async getAllNovels(
    @Req() request: RequestWithUser
  ): Promise<GetAllNovelsResponseDto> {
    const novels = await this.getAllNovelsQuery.execute(request.user.uid);

    return {
      data: novels.map((n) => ({
        id: n.id,
        title: n.generalInfo.title,
        description: n.generalInfo.description,
      })),
    };
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

  @Delete()
  @Auth()
  async deleteAllNovels(@Req() request: RequestWithUser): Promise<void> {
    await this.deleteNovelsCommand.execute(request.user.uid);
  }
}
