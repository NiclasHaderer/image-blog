export type NodeProps<T = undefined> = {
  id: string;
  children?: NodeProps<any>[];
} & (T extends undefined ? { data?: undefined } : { data: T });
