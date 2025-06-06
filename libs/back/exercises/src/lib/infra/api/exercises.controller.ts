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
  Query,
  Req,
  Sse,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { SseNotificationService } from '@owl/back/infra/sse';
import {
  HeartbeatEvent,
  NotificationEvent,
  SseEvent,
} from '@owl/shared/common/contracts';
import {
  connectedToExerciseEvent,
  disconnectedFromExerciseEvent,
  ExerciseDto,
  ExercisedUpdateEvent,
  GetAllExercisesResponseDto,
} from '@owl/shared/exercises/contracts';
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
  DeleteAllExercisesFromUserCommand,
  DeleteExerciseCommand,
  FinishExerciseCommand,
} from '../../domain/ports/in/exercises';
import { ExerciseToCreateDtoImpl } from './dtos/exercise-to-create.dto.impl';
import {
  toExerciseDto,
  toExerciseSummaryDto,
} from './mappers/exercise-dto.mappers';

@Controller('exercises')
@ApiBearerAuth()
export class ExercisesController {
  constructor(
    private readonly listExercisesQuery: ListExercisesQuery,
    private readonly createExerciseCommand: CreateExerciseCommand,
    private readonly getExerciseQuery: GetExerciseQuery,
    private readonly deleteExerciseCommand: DeleteExerciseCommand,
    private readonly finishExerciseCommand: FinishExerciseCommand,
    private readonly deleteAllExercisesFromUserCommand: DeleteAllExercisesFromUserCommand,
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

  @Delete('')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAll(@Req() request: RequestWithUser): Promise<void> {
    try {
      await this.deleteAllExercisesFromUserCommand.execute(request.user.uid);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
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
    const exercise = await this.getExerciseQuery.execute(request.user.uid, id);
    if (!exercise) {
      throw new NotFoundException();
    }

    const author = exercise?.findParticipant(request.user.uid);
    const room = exerciseConstants.getRoom(id);
    const stream = this.notificationService.registerToRoom(
      room,
      request.user.uid
    );

    setTimeout(() => {
      if (!author) {
        return;
      }
      this.notificationService.notifyRoom(
        room,
        new NotificationEvent(
          connectedToExerciseEvent,
          {
            author: author.name,
            exercise: exercise.generalInfo.name,
          },
          author.uid
        )
      );
      stream.next({
        data: new ExercisedUpdateEvent(
          toExerciseDto(
            exercise,
            process.env['BASE_API_URL'] || '',
            request.user.uid
          )
        ),
      });
    }, 50);
    const heartbeatInterval = setInterval(() => {
      stream.next({
        data: new HeartbeatEvent(),
      });
    }, 50000);

    request.res?.on('close', () => {
      clearInterval(heartbeatInterval);
      stream.complete();
      this.notificationService.unregisterFromRoom(room, stream);
      this.notificationService.notifyRoom(
        room,
        new NotificationEvent(
          disconnectedFromExerciseEvent,
          {
            author: author?.name,
            exercise: exercise.generalInfo.name,
          },
          request.user.uid
        )
      );
    });

    return stream;
  }
}
