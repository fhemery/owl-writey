import { uiFr } from './ui.fr';

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? // @ts-expect-error Type instantiation is excessively deep and possibly infinite
          `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
        : never;
    }[keyof T]
  : '';

// Create the final type for valid translation keys
export type TranslationKey = DotNestedKeys<typeof uiFr>;
