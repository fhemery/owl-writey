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
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { ExerciseDto, GetAllExercisesResponseDto } from '@owl/shared/contracts';

import {
  ExerciseException,
  ExerciseNotFoundException,
  ExerciseToCreate,
  QueryFilter,
} from '../../domain/model';
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
    private readonly finishExerciseCommand: FinishExerciseCommand
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
      exercises: exercises.map(toExerciseSummaryDto),
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
    return toExerciseDto(exercise);
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
}
