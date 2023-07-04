import { AbstractNode } from './abstract-node';
import { DIVIDER_NODE_ID, NodeProps } from '@image-blog/shared';
import { DividerIcon } from '@image-blog/shared-ui';

export type DividerNodeProps = NodeProps<undefined>;

export class DividerNode extends AbstractNode<DividerNodeProps> {
  public constructor() {
    super(DIVIDER_NODE_ID, ['divider', 'line', 'hr', 'horizontal rule', 'horizontal divider', 'horizontal line']);
  }

  public Name() {
    return 'Divider';
  }

  public override Icon({ size }: { size: number | string }) {
    return <DividerIcon style={{ width: size, height: size }} />;
  }

  public Render = () => <hr />;

  public empty(): DividerNodeProps {
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
