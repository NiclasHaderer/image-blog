import { AbstractNode } from './abstract-node';
import { DividerNodeDescription, NodeProps } from '@image-blog/shared';
import { DividerIcon } from '@image-blog/shared-ui';

export type DividerNodeProps = NodeProps<undefined>;

export class DividerNode extends AbstractNode<DividerNodeProps> {
  public constructor() {
    super(DividerNodeDescription, [
      'divider',
      'line',
      'hr',
      'horizontal rule',
      'horizontal divider',
      'horizontal line',
    ]);
  }

  public Name() {
    return 'Divider';
  }

  public override Icon({ size }: { size: number | string }) {
    return <DividerIcon style={{ width: size, height: size }} />;
  }

  public Render = () => <hr />;
}
