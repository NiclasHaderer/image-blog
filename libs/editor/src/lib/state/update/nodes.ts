import { NodeProps, RootNodeProps } from '../editor-state';
import { updateChildren } from './utils';
import { logger } from '../../logger';

const log = logger('nodes');

export const replaceNode = (state: RootNodeProps, path: number[], payload: NodeProps): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children, parent) => {
    const position = path.at(-1)!;
    // Child cannot be deleted
    if (!children[position].capabilities.canBeDeleted) return;
    // Parent has immutable children
    if (parent.capabilities.immutableChildren) return;
    children[position] = payload;
  });
};

export const addNode = (
  state: RootNodeProps,
  path: number[],
  insertMode: 'before' | 'after',
  ...payload: NodeProps[]
): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children, parent) => {
    // Parent has immutable children
    if (parent.capabilities.immutableChildren) {
      log.warn('Cannot add node', path, "Parent is marked as 'immutableChildren: true'");
      return;
    }
    // Parent has a max number of children
    if (parent.capabilities.maxChildren && children.length >= parent.capabilities.maxChildren) {
      log.warn('Cannot add node', path, 'Parent already has max number of children');
      return;
    }

    if (insertMode === 'before') {
      children.splice(path.at(-1)!, 0, ...payload);
    } else {
      children.splice(path.at(-1)! + 1, 0, ...payload);
    }
  });
};

export const deleteNode = (state: RootNodeProps, path: number[]): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children, parent) => {
    const position = path.at(-1)!;
    // Child cannot be deleted
    if (!children[position].capabilities.canBeDeleted) {
      log.warn('Cannot delete node', path, "Child is marked as 'canBeDeleted: false'");
      return;
    }
    // Parent has immutable children
    if (parent.capabilities.immutableChildren) {
      log.warn('Cannot delete node', path, "Parent is marked as 'immutableChildren: true'");
      return;
    }
    children.splice(position, 1);
  });
};
