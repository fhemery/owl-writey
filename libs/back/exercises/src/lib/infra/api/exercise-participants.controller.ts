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
import { UsersService } from '@owl/back/user';
import { ExerciseParticipantRole } from '@owl/shared/exercises/contracts';

import { ExerciseException } from '../../domain/model/exceptions/exercise-exception';
import { ExerciseRepository } from '../../domain/ports';

@Controller('exercises/:exerciseId/participants')
export class ExerciseParticipantsController {
  constructor(
    @Inject(ExerciseRepository)
    private readonly exerciseRepository: ExerciseRepository,
    private readonly usersService: UsersService
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
      exercise.removeParticipant(
        request.user.uid,
        participantId === 'me' ? request.user.uid : participantId
      );
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
