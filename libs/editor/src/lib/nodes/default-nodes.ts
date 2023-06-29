import { ControlNode } from './control-node';
import { ImageNode } from './image-node';
import { DividerNode } from './divider-node';
import { ColumnNode, ColumnNodeOutlet } from './column-node';

export const DEFAULT_NODES = [
  new ControlNode(),
  new ImageNode(),
  new DividerNode(),
  new ColumnNode(),
  new ColumnNodeOutlet(),
];
