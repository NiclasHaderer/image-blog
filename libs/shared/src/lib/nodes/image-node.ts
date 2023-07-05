import { NodeProps } from '../node-props';
import { NodeDescription } from './node-description';

export type ImageNodeProps = NodeProps<{
  src: string;
  caption?: string;
  width?: string;
}>;

export const ImageNodeDescription: NodeDescription<ImageNodeProps> = {
  id: 'image',
  capabilities: {
    canBeDeleted: true,
    canHaveChildren: false,
    canBeInnerFocused: true,
    structural: false,
  },
  empty() {
    return {
      id: this.id,
      data: {
        src: `data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E`,
        caption: '',
        width: '50%',
      },
    };
  },
};
