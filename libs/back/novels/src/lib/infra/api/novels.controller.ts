import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { toNovel, toNovelDto } from '@owl/shared/novel/utils';
import {
  GetAllNovelsResponseDto,
  NovelDto,
} from '@owl/shared/novels/contracts';

import {
  NovelNotAuthorException,
  NovelNotFoundException,
  NovelToCreate,
} from '../../domain/model';
import {
  CreateNovelCommand,
  DeleteAllNovelsCommand,
  DeleteNovelCommand,
  GetAllNovelsQuery,
  GetNovelQuery,
  UpdateNovelCommand,
} from '../../domain/ports';
import { NovelDtoImpl, NovelToCreateDtoImpl } from './dtos';

@Controller('novels')
@ApiBearerAuth()
export class NovelsController {
  constructor(
    private readonly createNovelCommand: CreateNovelCommand,
    private readonly getNovelQuery: GetNovelQuery,
    private readonly getAllNovelsQuery: GetAllNovelsQuery,
    private readonly deleteNovelsCommand: DeleteAllNovelsCommand,
    private readonly updateNovelCommand: UpdateNovelCommand,
    private readonly deleteNovelCommand: DeleteNovelCommand
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

    return toNovelDto(novel);
  }

  @Delete()
  @Auth()
  async deleteAllNovels(@Req() request: RequestWithUser): Promise<void> {
    await this.deleteNovelsCommand.execute(request.user.uid);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOneNovel(
    @Req() request: RequestWithUser,
    @Param('id') id: string
  ): Promise<void> {
    try {
      await this.deleteNovelCommand.execute(request.user.uid, id);
    } catch (error) {
      if (error instanceof NovelNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NovelNotAuthorException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFullNovel(
    @Req() request: RequestWithUser,
    @Param('id') novelId: string,
    @Body() novelDto: NovelDtoImpl
  ): Promise<void> {
    if (novelId !== novelDto.id) {
      throw new BadRequestException('ID mismatch');
    }
    try {
      const novel = toNovel(novelDto);
      await this.updateNovelCommand.execute(request.user.uid, novel);
    } catch (error) {
      if (error instanceof NovelNotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NovelNotAuthorException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
