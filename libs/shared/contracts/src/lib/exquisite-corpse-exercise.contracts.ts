import { AuthorDto } from './exercise.contracts';

const exquisiteCorpseEventPrefix = 'exCorpse';
export const exquisiteCorpseEvents = {
  connect: `${exquisiteCorpseEventPrefix}:connect`,
  updates: `${exquisiteCorpseEventPrefix}:updates`,
};

export interface ExquisiteCorpseContentDto {
  scenes: ExquisiteCorpseSceneDto[];
  currentWriter?: AuthorDto;
}

export interface ExquisiteCorpseSceneDto {
  id: number;
  text: string;
  author: AuthorDto;
}
