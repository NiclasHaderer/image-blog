import { AbstractNode } from './abstract-node';
import { EditorChild, EditorChildren, NodeProps, useNodeIndex } from '../state/editor-state';
import { ColumnIcon } from '../common/icons';
import { ControlNode } from './control-node';

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

  Render = <V extends ColumnNodeProps>({ children, data: { lWidth } }: V) => {
    const index = useNodeIndex();
    return (
      <div className="flex">
        <div className="w-1/2">
          <EditorChild index={[...index, 0]}>{children[0]}</EditorChild>
        </div>
        <div className="w-1/2">
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
        canBeInnerFocused: true,
        structural: false,
      },
    };
  }
}
