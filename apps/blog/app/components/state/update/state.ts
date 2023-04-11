import { NodeProps, RootNodeProps } from '../editor-state';
import { updateChildren } from './utils';

export const replaceNode = (state: RootNodeProps, path: number[], payload: NodeProps): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children) => {
    children[path.at(-1)!] = payload;
  });
};

export const addNode = (
  state: RootNodeProps,
  path: number[],
  insertMode: 'before' | 'after',
  ...payload: NodeProps[]
): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children) => {
    if (insertMode === 'before') {
      children.splice(path.at(-1)!, 0, ...payload);
    } else {
      children.splice(path.at(-1)! + 1, 0, ...payload);
    }
  });
};

export const deleteNode = (state: RootNodeProps, path: number[]): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children) => {
    children.splice(path.at(-1)!, 1);
  });
};
