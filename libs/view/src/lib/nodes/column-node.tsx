import { SkipUnknownNodes, ViewNode } from './view-node';
import {
  ColumnNodeDescription,
  ColumnNodeOutletDescription,
  ColumnNodeOutletProps,
  ColumnNodeProps,
} from '@image-blog/shared';
import { ViewEditorChild } from './view-editor-child';
import { DragIcon } from '@image-blog/shared-ui';
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
        <div style={{ width: lWidth }}>
          <ViewEditorChild node={children[0]} skipUnknownNodes={skipUnknownNodes} />
        </div>
        <div
          className="flex cursor-col-resize items-center absolute -translate-x-1/2 h-full top-0"
          style={{ left: lWidth }}
        >
          <DragIcon size={20} />
        </div>
        <div style={{ width: `calc(100% - ${lWidth})` }}>
          <ViewEditorChild node={children[1]} skipUnknownNodes={skipUnknownNodes} />
        </div>
      </div>
    );
  };
}
