import { SkipUnknownNodes, ViewNode } from './view-node';
import { DividerNodeProps, RootNodeDescription, RootNodeProps } from '@image-blog/shared';
import { ViewEditorChild } from './view-editor-child';
import { FC } from 'react';

export class RootViewNode extends ViewNode<RootNodeProps> {
  public constructor() {
    super(RootNodeDescription);
  }

  public Render: FC<DividerNodeProps & SkipUnknownNodes> = ({ children, skipUnknownNodes }) => {
    return (
      <>
        {children?.map((child, index) => (
          <ViewEditorChild node={child} key={index} skipUnknownNodes={skipUnknownNodes} />
        ))}
      </>
    );
  };
}
