import fuzzysort from 'fuzzysort';
import { JSX } from 'react';
import { NodeProps } from '@image-blog/shared';

export abstract class AbstractNode<T extends NodeProps> {
  protected constructor(public readonly id: string, public readonly searchTherms: string[]) {}

  public abstract Render(props: T): JSX.Element | null;

  public abstract Icon(props: { size: number | string }): JSX.Element | null;

  public abstract Name(): JSX.Element | string | null;

  public abstract empty(): T;

  public canHandle(type: T) {
    return this.id === type.id;
  }

  public distance(query: string): number {
    return fuzzysort.go(query, this.searchTherms)?.[0]?.score ?? -Infinity;
  }
}
