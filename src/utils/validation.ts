import { LuftInfer, LuftType } from '@luftschloss/validation';
import { ParsingResult } from '@luftschloss/validation/src/lib/types/base-type';

export const parseWith = <T extends LuftType, S extends 'safe' | 'unsafe' | undefined = undefined>(
  content: Record<string, any>,
  parser: T,
  { file, safety, mode = 'coerce' }: { file: string; safety?: S; mode?: 'coerce' | 'validate' },
): S extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T> => {
  if (safety === 'safe') {
    return parser[`${mode}Save`](content) as S extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>;
  }

  try {
    return parser[mode](content);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
    throw new Error(`Error parsing file ${file} with parser ${parser.validationStorage.name ?? parser.toString()}`);
  }
};
