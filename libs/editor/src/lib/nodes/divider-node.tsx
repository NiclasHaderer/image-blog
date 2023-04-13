import { AbstractNode } from './abstract-node';
import { DividerIcon } from '../common/icons';
import { NodeProps } from '../state/editor-state';

export type DividerNodeProps = NodeProps<undefined>;

export class DividerNode extends AbstractNode<DividerNodeProps> {
  constructor() {
    super('divider', ['divider', 'line', 'hr', 'horizontal rule', 'horizontal divider', 'horizontal line']);
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
      capabilities: {
        canBeDeleted: true,
        canHaveChildren: false,
        canBeInnerFocused: false,
        structural: false,
      },
    };
  }
}
