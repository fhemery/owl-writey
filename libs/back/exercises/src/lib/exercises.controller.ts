import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Auth, RequestWithUser } from '@owl/back/auth';
import { UsersController } from '@owl/back/user';
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
import { Exercise, ExerciseFactory } from './model/exercise';

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
    private readonly usersController: UsersController
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
    const user = await this.usersController.getUser(request.user.uid, request);

    const exercise = ExerciseFactory.From(
      id,
      exerciseDto.name,
      exerciseDto.type,
      exerciseDto.data
    );
    exercise.addParticipant(
      request.user.uid,
      user.name,
      ExerciseParticipantRole.Admin
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
}

function toExerciseDto(exercise: Exercise): ExerciseDto {
  return {
    id: exercise.id,
    name: exercise.name,
    type: exercise.type,
    data: exercise.data,
    participants: exercise.getParticipants().map((p) => ({
      uid: p.uid,
      name: p.name,
      isAdmin: p.role === ExerciseParticipantRole.Admin,
    })),
  };
}
