import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { UsersService } from '@owl/back/user';
import {
  ExerciseDto,
  ExerciseParticipantRole,
  ExerciseToCreateDto,
  ExerciseType,
  GetAllExercisesResponseDto,
} from '@owl/shared/contracts';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { v4 as uuidV4 } from 'uuid';

import { ExerciseRepository } from './exercise.repository';
import { Exercise, ExerciseParticipant } from './model/exercise';
import { ExerciseException } from './model/exercise-exception';
import { ExerciseFactory } from './model/exercise-factory';

export class ExerciseToCreateDtoImpl implements ExerciseToCreateDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsEnum(ExerciseType)
  type!: ExerciseType;

  data!: unknown;
}

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly usersService: UsersService
  ) {}

  @Get('')
  @Auth()
  async getAll(
    @Req() request: RequestWithUser
  ): Promise<GetAllExercisesResponseDto> {
    const exercises = await this.exerciseRepository.getAll(request.user.uid);
    return {
      exercises: exercises.map(toExerciseDto),
    };
  }

  @Post('')
  @Auth()
  async create(
    @Body() exerciseDto: ExerciseToCreateDtoImpl,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const id = uuidV4();
    const user = await this.usersService.get(request.user.uid);

    const exercise = ExerciseFactory.From(
      id,
      exerciseDto.name,
      exerciseDto.type,
      exerciseDto.data,
      [
        new ExerciseParticipant(
          request.user.uid,
          user?.name || 'Unknown',
          ExerciseParticipantRole.Admin
        ),
      ]
    );
    await this.exerciseRepository.create(exercise);

    request.res?.location(`/api/exercises/${id}`);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<ExerciseDto> {
    const exercise = await this.exerciseRepository.get(id);
    if (!exercise) {
      throw new NotFoundException();
    }
    return toExerciseDto(exercise);
  }

  @Post(':id/participants')
  @Auth()
  async addParticipant(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(id);
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

  @Delete(':id/participants/:participantId')
  @Auth()
  async removeParticipant(
    @Param('id') exerciseId: string,
    @Param('participantId') participantId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new NotFoundException();
    }

    try {
      exercise.removeParticipant(request.user.uid, participantId);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }

    await this.exerciseRepository.save(exercise);
    request.res?.status(204);
  }

  @Delete(':id')
  @Auth()
  async delete(
    @Param('id') exerciseId: string,
    @Req() request: RequestWithUser
  ): Promise<void> {
    const exercise = await this.exerciseRepository.get(exerciseId);
    if (!exercise) {
      throw new NotFoundException();
    }

    try {
      exercise.checkDelete(request.user.uid);

      await this.exerciseRepository.delete(exerciseId);
    } catch (err) {
      if (err instanceof ExerciseException) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
    request.res?.status(204);
  }
}

function toExerciseDto(exercise: Exercise): ExerciseDto {
  return {
    id: exercise.id,
    name: exercise.name,
    type: exercise.type,
    data: exercise.config,
    participants: exercise.getParticipants().map((p) => ({
      uid: p.uid,
      name: p.name,
      isAdmin: p.role === ExerciseParticipantRole.Admin,
    })),
  };
}
