import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Sse,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { SseNotificationService } from '@owl/back/websocket';
import {
  ConnectionToExerciseSuccessfulEvent,
  ExerciseDto,
  GetAllExercisesResponseDto,
  SseEvent,
} from '@owl/shared/contracts';
import { Observable } from 'rxjs';

import {
  ExerciseException,
  ExerciseNotFoundException,
  ExerciseToCreate,
  QueryFilter,
} from '../../domain/model';
import { exerciseConstants } from '../../domain/model/exercise-constants';
import { GetExerciseQuery, ListExercisesQuery } from '../../domain/ports';
import {
  CreateExerciseCommand,
  DeleteExerciseCommand,
  FinishExerciseCommand,
} from '../../domain/ports/in/exercises';
import { ExerciseToCreateDtoImpl } from './dtos/exercise-to-create.dto.impl';
import {
  toExerciseDto,
  toExerciseSummaryDto,
} from './mappers/exercise-dto.mappers';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly listExercisesQuery: ListExercisesQuery,
    private readonly createExerciseCommand: CreateExerciseCommand,
    private readonly getExerciseQuery: GetExerciseQuery,
    private readonly deleteExerciseCommand: DeleteExerciseCommand,
    private readonly finishExerciseCommand: FinishExerciseCommand,
    private readonly notificationService: SseNotificationService
  ) {}

  @Get('')
  @Auth()
  async getAll(
    @Req() request: RequestWithUser,
    @Query('includeFinished') includeFinished?: string
  ): Promise<GetAllExercisesResponseDto> {
    const exercises = await this.listExercisesQuery.execute(
      request.user.uid,
      new QueryFilter(includeFinished === 'true')
    );
    return {
      exercises: exercises.map((e) =>
        toExerciseSummaryDto(e, process.env['BASE_API_URL'] || '')
      ),
    };
  }

  @Post('')
  @Auth()
  async create(
    @Body() exerciseDto: ExerciseToCreateDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      const id = await this.createExerciseCommand.execute(
        request.user.uid,
        new ExerciseToCreate(
          exerciseDto.name,
          exerciseDto.type,
          exerciseDto.config
        )
      );
      request.res?.location(`/api/exercises/${id}`);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get(':id')
  @Auth()
  async get(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<ExerciseDto> {
    const exercise = await this.getExerciseQuery.execute(request.user.uid, id);
    if (!exercise) {
      throw new NotFoundException();
    }
    return toExerciseDto(
      exercise,
      process.env['BASE_API_URL'] || '',
      request.user.uid
    );
  }

  @Delete(':id')
  @Auth()
  async delete(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      await this.deleteExerciseCommand.execute(request.user.uid, exerciseId);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      } else if (err instanceof ExerciseNotFoundException) {
        throw new NotFoundException();
      }
      throw err;
    }
    request.res?.status(204);
  }

  @Post(':id/finish')
  @Auth()
  @HttpCode(204)
  async finish(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    try {
      await this.finishExerciseCommand.execute(request.user.uid, exerciseId);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      } else if (err instanceof ExerciseNotFoundException) {
        throw new NotFoundException();
      }
      throw err;
    }
  }

  @Auth()
  @Sse(':id/events')
  async getEvents(
    @Req() request: RequestWithUser,
    @Param('id') id: string
  ): Promise<Observable<{ data: SseEvent }>> {
    const stream = this.notificationService.registerToRoom(
      exerciseConstants.getRoom(id),
      request.user.uid
    );

    // TODO : return error if user does not belong to exercise.
    // TODO : 404 if exercise does not exist

    const exercise = await this.getExerciseQuery.execute(request.user.uid, id);

    if (!exercise) {
      throw new NotFoundException();
    }
    stream.next({
      data: new ConnectionToExerciseSuccessfulEvent(
        exercise?.generalInfo.name || ''
      ),
    });

    return stream;
  }
}
