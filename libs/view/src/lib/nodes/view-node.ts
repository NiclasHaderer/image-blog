import { NodeProps } from '@image-blog/shared';
import { JSX } from 'react';

export interface ViewNode<T extends NodeProps> {
  readonly id: string;

  canHandle(type: NodeProps): boolean;

  Render(type: T, skipUnknownNodes?: boolean): JSX.Element | string | null;
}
