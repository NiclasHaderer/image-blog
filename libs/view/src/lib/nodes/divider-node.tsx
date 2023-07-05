import { SkipUnknownNodes, ViewNode } from './view-node';
import { DividerNodeDescription, DividerNodeProps } from '@image-blog/shared';
import { FC } from 'react';

export class DividerViewNode extends ViewNode<DividerNodeProps> {
  public constructor() {
    super(DividerNodeDescription);
  }

  public Render: FC<DividerNodeProps & SkipUnknownNodes> = (_) => {
    return <hr className="my-2" />;
  };
}
