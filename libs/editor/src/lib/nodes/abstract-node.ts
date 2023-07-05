import fuzzysort from 'fuzzysort';
import { JSX } from 'react';
import { NodeDescription, NodeProps } from '@image-blog/shared';

export abstract class AbstractNode<T extends NodeProps> {
  protected constructor(public readonly nodeDescription: NodeDescription<T>, public readonly searchTherms: string[]) {}

  public get id() {
    return this.nodeDescription.id;
  }

  public empty() {
    return this.nodeDescription.empty();
  }

  public abstract Render(props: T): JSX.Element | null;

  public abstract Icon(props: { size: number | string }): JSX.Element | null;

  public abstract Name(): JSX.Element | string | null;

  public canHandle(type: T) {
    return this.nodeDescription.id === type.id;
  }

  public distance(query: string): number {
    return fuzzysort.go(query, this.searchTherms)?.[0]?.score ?? -Infinity;
  }
}
