import { LuftInfer, LuftType } from '@luftschloss/validation';
import { ParsingResult } from '@luftschloss/validation/src/lib/types/base-type';

export const parseWith = <T extends LuftType, M extends 'safe' | 'unsafe' | undefined = undefined>(
  content: Record<string, any>,
  parser: T,
  { file, mode }: { file: string; mode?: M },
): M extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T> => {
  if (mode === 'safe') {
    return parser.coerceSave(content) as M extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>;
  }

  try {
    return parser.coerce(content);
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
    throw new Error(`Error parsing file ${file} with parser ${parser.validationStorage.name ?? parser.toString()}`);
  }
};
