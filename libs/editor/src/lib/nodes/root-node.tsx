import { AbstractNode } from './abstract-node';
import { RootNodeDescription, RootNodeProps } from '@image-blog/shared';
import { EditorChildren } from '../editor-building-blocks';
import { FC } from 'react';

export class RootNode extends AbstractNode<RootNodeProps> {
  public constructor() {
    super(RootNodeDescription, []);
  }

  public Name = () => '';

  public override Icon = () => null;

  public Render: FC<RootNodeProps> = (props) => {
    return <EditorChildren>{props}</EditorChildren>;
  };
}
