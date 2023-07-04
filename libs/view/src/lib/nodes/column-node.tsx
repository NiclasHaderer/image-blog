import { ViewNode } from './view-node';
import {
  COLUMN_NODE_ID,
  COLUMN_OUTLET_ID,
  ColumnNodeOutletProps,
  ColumnNodeProps,
  DragIcon,
  NodeProps,
} from '@image-blog/shared';
import { ViewEditorChild } from './view-editor-child';

export const ColumnOutletViewNode: ViewNode<ColumnNodeOutletProps> = {
  id: COLUMN_OUTLET_ID,
  canHandle(type: NodeProps): boolean {
    return type.id === this.id;
  },
  Render(type: ColumnNodeOutletProps, skipUnknownNodes = true): React.JSX.Element | string | null {
    return <ViewEditorChild node={type.children![0]} skipUnknownNodes={skipUnknownNodes} />;
  },
};

export const ColumnViewNode: ViewNode<ColumnNodeProps> = {
  id: COLUMN_NODE_ID,
  canHandle(type: NodeProps): boolean {
    return type.id === this.id;
  },
  Render({ children, ...type }: ColumnNodeProps, skipUnknownNodes = true): React.JSX.Element | string | null {
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
  },
};
