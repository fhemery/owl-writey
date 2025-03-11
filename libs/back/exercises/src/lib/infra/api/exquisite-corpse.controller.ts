import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { SseNotificationService } from '@owl/back/websocket';
import {
  AuthorDto,
  ExquisiteCorpseTurnTakenEvent,
} from '@owl/shared/contracts';

import { ExerciseException, ExquisiteCorpseExercise } from '../../domain/model';
import { exerciseConstants } from '../../domain/model/exercise-constants';
import { GetExerciseQuery, TakeTurnCommand } from '../../domain/ports';
import { toExerciseDto } from './mappers/exercise-dto.mappers';

@Controller('exquisite-corpse')
export class ExquisiteCorpseController {
  constructor(
    private readonly takeTurnCommand: TakeTurnCommand,
    private readonly getExerciseQuery: GetExerciseQuery,
    private readonly notificationService: SseNotificationService
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

      //TODO We don't want to do this here... we should have it done from the command
      // And that's not the only thing going wrong here
      // TODO I don't want to have to call BASE_APP_URL everytime I need to perform a mapping
      const exercise = (await this.getExerciseQuery.execute(
        request.user.uid,
        exerciseId
      )) as ExquisiteCorpseExercise;
      this.notificationService.notifyRoom(
        exerciseConstants.getRoom(exercise.id),
        new ExquisiteCorpseTurnTakenEvent(
          toExerciseDto(
            exercise,
            process.env['BASE_APP_URL'] || '',
            request.user.uid
          ),
          exercise?.content?.currentWriter?.author || ({} as AuthorDto)
        )
      );
    } catch (e) {
      if (e instanceof ExerciseException) {
        throw new BadRequestException(e.message);
      }
    }
  }
}
