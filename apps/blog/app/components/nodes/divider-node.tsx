import { EditorNode } from './editor-node';
import { DividerIcon } from '../common/icons';
import { NodeProps } from '../state/editor-state';

export type DividerNodeProps = NodeProps<undefined>;

export class DividerNode extends EditorNode<DividerNodeProps> {
  constructor() {
    super(
      'divider',
      {
        canBeDeleted: true,
        canBeInnerFocused: false,
        structural: false,
      },
      ['divider', 'line', 'hr', 'horizontal rule', 'horizontal divider', 'horizontal line']
    );
  }

  Name() {
    return 'Divider';
  }

  override Icon({ size }: { size: number | string }) {
    return <DividerIcon style={{ width: size, height: size }} />;
  }

  Render = () => <hr />;

  empty(): DividerNodeProps {
    return {
      id: this.id,
      data: undefined,
    };
  }
}
