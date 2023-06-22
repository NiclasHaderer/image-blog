import { AbstractNode } from './abstract-node';
import { NodeProps, useIsNodeInnerFocused, useNodeIndex, useUpdateEditor } from '../state/editor-state';
import { ColumnIcon, DragIcon } from '../common/icons';
import { ControlNode } from './control-node';
import { useEffect, useRef } from 'react';
import { useGlobalEvent } from '../hooks/global-events';
import { EditorChild, EditorChildren } from '../editor-building-blocks';

type ColumnNodeOutletProps = NodeProps;

export class ColumnNodeOutlet extends AbstractNode<ColumnNodeOutletProps> {
  constructor() {
    super('column-outlet', []);
  }

  Render(props: ColumnNodeOutletProps): JSX.Element | null {
    return <EditorChildren>{props}</EditorChildren>;
  }

  Name = () => null;
  Icon = () => null;

  empty(): ColumnNodeOutletProps {
    return ColumnNodeOutlet.empty();
  }

  public static empty(): ColumnNodeOutletProps {
    return {
      id: 'column-outlet',
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

interface ColumnNodeProps
  extends NodeProps<{
    lWidth: string;
  }> {
  children: [NodeProps, NodeProps];
}

export class ColumnNode extends AbstractNode<ColumnNodeProps> {
  constructor() {
    super('column', ['column', 'columns', 'two columns', 'two column node']);
  }

  Name = () => 'Column';
  Icon = ({ size }: { size: string | number }) => <ColumnIcon width={size} height={size} />;

  Render = <V extends ColumnNodeProps>({ children, data: { lWidth }, capabilities }: V) => {
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

  empty(): ColumnNodeProps {
    return {
      id: this.id,
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
