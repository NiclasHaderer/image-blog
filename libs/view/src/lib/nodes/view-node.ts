import { NodeProps } from '@image-blog/common';
import { JSX } from 'react';

export interface ViewNode<T extends NodeProps> {
  canHandle(type: NodeProps): boolean;

  Render(type: T): JSX.Element | string | null;
}
