import {
  BadRequestException,
  Controller,
  Delete,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { EventEmitterFacade } from '@owl/back/infra/events';
import { UsersService } from '@owl/back/user';
import { ExerciseParticipantRole } from '@owl/shared/exercises/contracts';

import {
  ExerciseUserJoinedEvent,
  ExerciseUserLeftEvent,
  ExerciseUserRemovedEvent,
} from '../../domain/model';
import { ExerciseException } from '../../domain/model/exceptions/exercise-exception';
import { ExerciseRepository } from '../../domain/ports';

@Controller('exercises/:exerciseId/participants')
export class ExerciseParticipantsController {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private readonly usersService: UsersService,
    private readonly eventEmitterFacade: EventEmitterFacade
  ) {}

  @Post()
  @Auth()
  async addParticipant(
    @Param('exerciseId') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new NotFoundException();
    }

    const user = await this.usersService.get(request.user.uid);
    if (!user) {
      throw new NotFoundException();
    }

    try {
      exercise.addParticipant(
        request.user.uid,
        user.name,
        ExerciseParticipantRole.Participant
      );
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
    }

    await this.exerciseRepository.save(exercise);
    this.eventEmitterFacade.emit(
      new ExerciseUserJoinedEvent(request.user.uid, exercise)
    );
    request.res?.status(204);
  }

  @Delete(':participantId')
  @Auth()
  async removeParticipant(
    @Param('exerciseId') exerciseId: string,
    @Param('participantId') participantId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new NotFoundException();
    }

    try {
      const targetUserId =
        participantId === 'me' ? request.user.uid : participantId;
      exercise.removeParticipant(request.user.uid, targetUserId);

      if (targetUserId === request.user.uid) {
        this.eventEmitterFacade.emit(
          new ExerciseUserLeftEvent(request.user.uid, exercise)
        );
      } else {
        this.eventEmitterFacade.emit(
          new ExerciseUserRemovedEvent(request.user.uid, exercise, targetUserId)
        );
      }
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }

    await this.exerciseRepository.save(exercise);
    request.res?.status(204);
  }
}
