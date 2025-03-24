import { AuthorDto, ExerciseDto, ExerciseLinksDto } from './exercise.contracts';

const exquisiteCorpseEventPrefix = 'exCorpse';
export const exquisiteCorpseEvents = {
  connect: `${exquisiteCorpseEventPrefix}:connect`,
  updates: `${exquisiteCorpseEventPrefix}:updates`,
  takeTurn: `${exquisiteCorpseEventPrefix}:takeTurn`,
  submitTurn: `${exquisiteCorpseEventPrefix}:submitTurn`,
  cancelTurn: `${exquisiteCorpseEventPrefix}:cancelTurn`,
};

export interface ExquisiteCorpseExerciseDto extends ExerciseDto {
  _links: ExquisiteCorpseLinksDto;
  content: ExquisiteCorpseContentDto;
  config: ExquisiteCorpseConfigDto;
}

export interface ExquisiteCorpseConfigDto {
  nbIterations?: number;
  initialContent?: string;
  iterationDuration?: number;
  textSize?: { minWords?: number; maxWords?: number };
}

export interface ExquisiteCorpseContentDto {
  scenes: ExquisiteCorpseSceneDto[];
  currentWriter?: ExquisiteCorpseCurrentWriterDto;
}

export interface ExquisiteCorpseCurrentWriterDto {
  author: AuthorDto;
  until: string;
}

export interface ExquisiteCorpseSceneDto {
  id: number;
  text: string;
  author: AuthorDto;
}

export interface ExquisiteCorpseLinksDto extends ExerciseLinksDto {
  takeTurn?: string;
  cancelTurn?: string;
  submitTurn?: string;
}

export interface SubmitTurnRequestDto {
  content: string;
}
