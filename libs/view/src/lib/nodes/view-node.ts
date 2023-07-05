import { NodeDescription, NodeProps } from '@image-blog/shared';
import { FC } from 'react';

export type SkipUnknownNodes = { skipUnknownNodes: boolean };

export abstract class ViewNode<T extends NodeProps<any>> {
  public constructor(public readonly nodeDescription: NodeDescription<T>) {}

  public get id() {
    return this.nodeDescription.id;
  }

  public canHandle(type: NodeProps) {
    return this.nodeDescription.id === type.id;
  }

  public abstract Render: FC<T & SkipUnknownNodes>;
}
