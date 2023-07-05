import { ViewNode } from './view-node';
import {
  ColumnNodeDescription,
  ColumnNodeOutletDescription,
  ColumnNodeOutletProps,
  ColumnNodeProps,
} from '@image-blog/shared';
import { ViewEditorChild } from './view-editor-child';
import { DragIcon } from '@image-blog/shared-ui';

export class ColumnOutletViewNode extends ViewNode<ColumnNodeOutletProps> {
  public constructor() {
    super(ColumnNodeOutletDescription);
  }

  public Render(type: ColumnNodeOutletProps, skipUnknownNodes = true): React.JSX.Element | string | null {
    return <ViewEditorChild node={type.children![0]} skipUnknownNodes={skipUnknownNodes} />;
  }
}

export class ColumnViewNode extends ViewNode<ColumnNodeProps> {
  public constructor() {
    super(ColumnNodeDescription);
  }

  public Render({ children, ...type }: ColumnNodeProps, skipUnknownNodes = true): React.JSX.Element | string | null {
    const lWidth = type.data.lWidth;
    return (
      <div className="flex relative">
        <div style={{ width: lWidth }}>
          <ViewEditorChild node={children[0]} skipUnknownNodes={true} />
        </div>
        <div
          className="flex cursor-col-resize items-center absolute -translate-x-1/2 h-full top-0"
          style={{ left: lWidth }}
        >
          <DragIcon size={20} />
        </div>
        <div style={{ width: `calc(100% - ${lWidth})` }}>
          <ViewEditorChild node={children[1]} skipUnknownNodes={true} />
        </div>
      </div>
    );
  }
}
