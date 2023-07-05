import fuzzysort from 'fuzzysort';
import { FC } from 'react';
import { NodeDescription, NodeProps } from '@image-blog/shared';

export abstract class AbstractNode<T extends NodeProps<any>> {
  protected constructor(public readonly nodeDescription: NodeDescription<T>, public readonly searchTherms: string[]) {}

  public get id() {
    return this.nodeDescription.id;
  }

  public empty() {
    return this.nodeDescription.empty();
  }

  public abstract Render: FC<T>;

  public abstract Icon(props: { size: number | string }): ReturnType<FC>;

  public abstract Name(): ReturnType<FC>;

  public canHandle(type: T) {
    return this.nodeDescription.id === type.id;
  }

  public distance(query: string): number {
    return fuzzysort.go(query, this.searchTherms)?.[0]?.score ?? -Infinity;
  }
}
