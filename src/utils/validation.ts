import { LuftInfer, LuftObject } from '@luftschloss/validation';
import { ParsingResult } from '@luftschloss/validation/';

export const parseWith = <T extends LuftObject<any>, S extends 'safe' | 'unsafe' | undefined = undefined>(
  content: Record<string, any>,
  parser: T,
  {
    file,
    safety,
    mode = 'coerce',
    ignoreUnknownKeys,
  }: {
    file: string;
    safety?: S;
    mode?: 'coerce' | 'validate';
    ignoreUnknownKeys: boolean;
  },
): S extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T> => {
  parser = parser.ignoreUnknownKeys(ignoreUnknownKeys) as T;

  if (safety === 'safe') {
    return parser[`${mode}Save`](content) as S extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>;
  }

  try {
    return parser[mode](content) as S extends 'safe' ? ParsingResult<LuftInfer<T>> : LuftInfer<T>;
  } catch (e) {
    console.error(JSON.stringify(e, null, 2));
    throw new Error(`Error parsing file ${file} with parser ${parser.validationStorage.name ?? parser.toString()}`);
  }
};
