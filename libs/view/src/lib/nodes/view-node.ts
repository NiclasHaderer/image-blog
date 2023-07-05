import { NodeDescription, NodeProps } from '@image-blog/shared';
import { JSX } from 'react';

export abstract class ViewNode<T extends NodeProps> {
  public constructor(public readonly nodeDescription: NodeDescription<T>) {}

  public get id() {
    return this.nodeDescription.id;
  }

  public canHandle(type: NodeProps) {
    return this.nodeDescription.id === type.id;
  }

  public abstract Render(type: T, skipUnknownNodes?: boolean): JSX.Element | string | null;
}
