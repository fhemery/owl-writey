import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';

import { ExerciseException } from '../../domain/model';
import { GetExerciseQuery, TakeTurnCommand } from '../../domain/ports';

@Controller('exquisite-corpse')
export class ExquisiteCorpseController {
  constructor(
    private readonly takeTurnCommand: TakeTurnCommand,
    private readonly getExerciseQuery: GetExerciseQuery
  ) {}

  @Post(':id/take-turn')
  @Auth()
  @HttpCode(204)
  async takeTurn(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      await this.takeTurnCommand.execute(request.user.uid, exerciseId);

      await this.getExerciseQuery.execute(request.user.uid, exerciseId);
    } catch (e) {
      if (e instanceof ExerciseException) {
        throw new BadRequestException(e.message);
      }
    }
  }
}
