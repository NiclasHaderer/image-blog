import { NodeProps } from '../state/editor-state';
import fuzzysort from 'fuzzysort';
import { JSX } from 'react';

export abstract class AbstractNode<T extends NodeProps> {
  protected constructor(public readonly id: string, public readonly searchTherms: string[]) {}

  abstract Render(props: T): JSX.Element | null;

  abstract Icon(props: { size: number | string }): JSX.Element | null;

  abstract Name(): JSX.Element | string | null;

  abstract empty(): T;

  public canHandle(type: T) {
    return this.id === type.id;
  }

  public distance(query: string): number {
    return fuzzysort.go(query, this.searchTherms)?.[0]?.score ?? -Infinity;
  }
}
