import { AuthorDto } from './exercise.contracts';

const exquisiteCorpseEventPrefix = 'exCorpse';
export const exquisiteCorpseEvents = {
  connect: `${exquisiteCorpseEventPrefix}:connect`,
  updates: `${exquisiteCorpseEventPrefix}:updates`,
  takeTurn: `${exquisiteCorpseEventPrefix}:takeTurn`,
  submitTurn: `${exquisiteCorpseEventPrefix}:submitTurn`,
};

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
