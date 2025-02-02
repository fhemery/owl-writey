import { Body, Controller, Post } from '@nestjs/common';
import { Auth } from '@owl/back/auth';

import { NovelToCreateDtoImpl } from './dtos/novel-to-create.dto.impl';

@Controller('novels')
export class NovelsController {
  @Post()
  @Auth()
  async createNovel(@Body() novel: NovelToCreateDtoImpl): Promise<void> {
    return Promise.resolve();
  }
}
