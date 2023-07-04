import { NodeProps } from '../node-props';

export type ImageNodeProps = NodeProps<{
  src: string;
  caption?: string;
  width?: string;
}>;

export const IMAGE_NODE_ID = 'image';
