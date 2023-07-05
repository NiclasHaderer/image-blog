import { SkipUnknownNodes, ViewNode } from './view-node';
import {
  ColumnNodeDescription,
  ColumnNodeOutletDescription,
  ColumnNodeOutletProps,
  ColumnNodeProps,
} from '@image-blog/shared';
import { ViewEditorChild } from './view-editor-child';
import { FC } from 'react';

export class ColumnOutletViewNode extends ViewNode<ColumnNodeOutletProps> {
  public constructor() {
    super(ColumnNodeOutletDescription);
  }

  public Render: FC<ColumnNodeOutletProps & SkipUnknownNodes> = ({ skipUnknownNodes, ...type }) => {
    return <ViewEditorChild node={type.children![0]} skipUnknownNodes={skipUnknownNodes} />;
  };
}

export class ColumnViewNode extends ViewNode<ColumnNodeProps> {
  public constructor() {
    super(ColumnNodeDescription);
  }

  public Render: FC<ColumnNodeProps & { skipUnknownNodes: boolean }> = ({ children, skipUnknownNodes, ...type }) => {
    const lWidth = type.data.lWidth;
    return (
      <div className="flex relative">
        <div className="pr-1" style={{ width: lWidth }}>
          <ViewEditorChild node={children[0]} skipUnknownNodes={skipUnknownNodes} />
        </div>
        <div className="pl-1" style={{ width: `calc(100% - ${lWidth})` }}>
          <ViewEditorChild node={children[1]} skipUnknownNodes={skipUnknownNodes} />
        </div>
      </div>
    );
  };
}
