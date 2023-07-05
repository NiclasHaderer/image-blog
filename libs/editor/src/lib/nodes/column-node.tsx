import { AbstractNode } from './abstract-node';
import { useIsNodeInnerFocused, useNodeIndex, useUpdateEditor } from '../state-holder';
import { ColumnIcon, DragIcon } from '@image-blog/shared-ui';
import { ControlNode } from './control-node';
import { useEffect, useRef } from 'react';
import { useGlobalEvent } from '../hooks/global-events';
import { EditorChild, EditorChildren } from '../editor-building-blocks';
import { COLUMN_NODE_ID, COLUMN_OUTLET_ID, ColumnNodeOutletProps, ColumnNodeProps } from '@image-blog/shared';

export class ColumnNodeOutlet extends AbstractNode<ColumnNodeOutletProps> {
  public constructor() {
    super(COLUMN_OUTLET_ID, []);
  }

  public Render(props: ColumnNodeOutletProps): JSX.Element | null {
    return <EditorChildren>{props}</EditorChildren>;
  }

  public Name = () => null;
  public Icon = () => null;

  public empty(): ColumnNodeOutletProps {
    return ColumnNodeOutlet.empty();
  }

  public static empty(): ColumnNodeOutletProps {
    return {
      id: COLUMN_OUTLET_ID,
      children: [ControlNode.empty()],
      data: undefined,
      capabilities: {
        canBeDeleted: false,
        canBeInnerFocused: false,
        immutableChildren: false,
        canHaveChildren: true,
        minChildren: 1,
        maxChildren: Infinity,
        structural: true,
      },
    };
  }
}

export class ColumnNode extends AbstractNode<ColumnNodeProps> {
  public constructor() {
    super(COLUMN_NODE_ID, ['column', 'columns', 'two columns', 'two column node']);
  }

  public Name = () => 'Column';
  public Icon = ({ size }: { size: string | number }) => <ColumnIcon width={size} height={size} />;

  public Render = <V extends ColumnNodeProps>({ children, data: { lWidth }, capabilities }: V) => {
    const index = useNodeIndex();
    const dispatch = useUpdateEditor();
    const { force, isFocused } = useIsNodeInnerFocused();
    const resize = useRef(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      isFocused && force && dispatch('focus', { at: [...index, 0], force: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, force]);
    useGlobalEvent('mouseup', () => {
      resize.current = false;
    });

    useGlobalEvent('mousemove', (e) => {
      if (!resize.current) return;
      const wrapperRect = wrapperRef.current!.getBoundingClientRect();
      const xWidth = wrapperRect.width;
      const xStart = wrapperRect.x;
      const newPxWidth = e.clientX - xStart;
      const newWidth = `${(newPxWidth / xWidth) * 100}%`;
      dispatch('replace', {
        at: index,
        with: { id: this.id, children, data: { lWidth: newWidth }, capabilities },
      });
    });

    return (
      <div className="flex relative" ref={wrapperRef}>
        <div style={{ width: lWidth }}>
          <EditorChild index={[...index, 0]}>{children[0]}</EditorChild>
        </div>
        <div
          className="flex cursor-col-resize items-center absolute -translate-x-1/2 h-full top-0"
          style={{ left: lWidth }}
          onMouseDown={() => (resize.current = true)}
        >
          <DragIcon size={20} />
        </div>
        <div style={{ width: `calc(100% - ${lWidth})` }}>
          <EditorChild index={[...index, 1]}>{children[1]}</EditorChild>
        </div>
      </div>
    );
  };

  public empty(): ColumnNodeProps {
    return ColumnNode.empty();
  }

  public static empty(): ColumnNodeProps {
    return {
      id: COLUMN_NODE_ID,
      children: [ColumnNodeOutlet.empty(), ColumnNodeOutlet.empty()],
      data: {
        lWidth: '50%',
      },
      capabilities: {
        canBeDeleted: true,
        canHaveChildren: true,
        immutableChildren: true,
        canBeInnerFocused: false,
        structural: false,
      },
    };
  }
}
