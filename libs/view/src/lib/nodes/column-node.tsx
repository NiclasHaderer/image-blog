import { ViewNode } from './view-node';
import {
  COLUMN_NODE_ID,
  COLUMN_OUTLET_ID,
  ColumnNodeOutletProps,
  ColumnNodeProps,
  DragIcon,
  NodeProps,
} from '@image-blog/common';
import { ViewEditorChild } from './view-editor-child';

export const ColumnViewNodeOutlet: ViewNode<ColumnNodeOutletProps> = {
  canHandle(type: NodeProps): boolean {
    return type.id === COLUMN_OUTLET_ID;
  },
  Render(type: ColumnNodeOutletProps): React.JSX.Element | string | null {
    return <ViewEditorChild node={type.children![0]} />;
  },
};

export const ColumnViewNode: ViewNode<ColumnNodeProps> = {
  canHandle(type: NodeProps): boolean {
    return type.id === COLUMN_NODE_ID;
  },
  Render({ children, ...type }: ColumnNodeProps): React.JSX.Element | string | null {
    const lWidth = type.data.lWidth;
    return (
      <div className="flex relative">
        <div style={{ width: lWidth }}>
          <ViewEditorChild node={children[0]} />
        </div>
        <div
          className="flex cursor-col-resize items-center absolute -translate-x-1/2 h-full top-0"
          style={{ left: lWidth }}
        >
          <DragIcon size={20} />
        </div>
        <div style={{ width: `calc(100% - ${lWidth})` }}>
          <ViewEditorChild node={children[1]} />
        </div>
      </div>
    );
  },
};
