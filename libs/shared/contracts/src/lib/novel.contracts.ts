export interface NovelToCreateDto {
  title: string;
  description: string;
}

export enum NovelRole {
  Author = 'Author',
}

export interface NovelSummaryDto {
  id: string;
  title: string;
  description: string;
}

export interface NovelDto {
  id: string;
  title: string;
  description: string;
  chapters: ChapterDto[];
}

export interface ChapterDto {
  id: string;
  title: string;
  outline: string;
}

export interface GetAllNovelsResponseDto {
  data: NovelSummaryDto[];
}
