export interface NodeProps<T = any> {
  id: string;
  children?: NodeProps[];
  data: T;
}
