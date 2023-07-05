export type NodeProps<T = undefined> = {
  id: string;
  children?: NodeProps[];
} & (T extends undefined ? { data?: undefined } : { data: T });
