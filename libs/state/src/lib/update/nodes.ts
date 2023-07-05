import { NodeDescriptions, NodeProps, RootNodeProps } from '@image-blog/shared';
import { getNodeCapabilities, updateChildren } from './utils';
import { logger } from '@image-blog/shared';

const log = logger('nodes');

export const replaceNode = (
  state: RootNodeProps,
  path: number[],
  payload: NodeProps,
  descriptions: NodeDescriptions
): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children, parent) => {
    const position = path.at(-1)!;
    const childCapabilities = getNodeCapabilities(children[position], descriptions);
    // Child cannot be deleted
    if (!childCapabilities.canBeDeleted) return;

    const parentCapabilities = getNodeCapabilities(parent, descriptions);
    // Parent has immutable children
    if (parentCapabilities.immutableChildren) return;
    children[position] = payload;
  });
};

export const addNode = (
  state: RootNodeProps,
  path: number[],
  insertMode: 'before' | 'after',
  payload: NodeProps[],
  descriptions: NodeDescriptions
): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children, parent) => {
    // Parent has immutable children
    const parentCapabilities = getNodeCapabilities(parent, descriptions);
    if (parentCapabilities.immutableChildren) {
      log.warn('Cannot add node', path, "Parent is marked as 'immutableChildren: true'");
      return;
    }
    // Parent has a max number of children
    if (parentCapabilities.maxChildren && children.length >= parentCapabilities.maxChildren) {
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

export const deleteNode = (state: RootNodeProps, path: number[], descriptions: NodeDescriptions): RootNodeProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children, parent) => {
    const position = path.at(-1)!;

    const childCapabilities = getNodeCapabilities(children[position], descriptions);
    // Child cannot be deleted
    if (!childCapabilities.canBeDeleted) {
      log.warn('Cannot delete node', path, "Child is marked as 'canBeDeleted: false'");
      return;
    }

    const parentCapabilities = getNodeCapabilities(parent, descriptions);
    // Parent has immutable children
    if (parentCapabilities.immutableChildren) {
      log.warn('Cannot delete node', path, "Parent is marked as 'immutableChildren: true'");
      return;
    }
    children.splice(position, 1);
  });
};
