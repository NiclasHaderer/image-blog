import { logger, NodeCapabilities, NodeDescriptions, NodeProps, RootNodeProps } from '@image-blog/shared';

const log = logger('utils');

const returnIfConditionOrElse = (
  root: RootNodeProps,
  path: number[] | null | undefined,
  condition: ((props: NodeProps) => boolean) | undefined,
  callback: (root: RootNodeProps, path: number[], condition?: (props: NodeProps) => boolean) => number[] | null
): number[] | null => {
  if (!path) return null;
  const node = getNodeProps(root, path);
  if (!node) return null;
  if (condition && !condition(node)) {
    return callback(root, path, condition);
  }
  return path;
};

export const getPreviousNode = (
  root: RootNodeProps,
  path: number[],
  condition?: (props: NodeProps) => boolean
): number[] | null => {
  if (!path) return null;
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNodeProps(root, parentPath);

  if (!parent || !parent.children) {
    log.debug('No parent or no children', { parent, children: parent?.children });
    return null;
  }

  const index = path.at(-1)!;
  // If it is not the last node in the parent, we can just go to the previous node
  if (index > 0) {
    const lastNode = getLastNode(root, [...parentPath, index - 1]);
    return returnIfConditionOrElse(root, lastNode, condition, getPreviousNode);
  } else {
    // We are at the very top and there are no parents further up and no previous nodes
    if (parentPath.length === 0) {
      log.debug("Reached the top, can't go further up");
      return null;
    }

    // We are the first node of this parent, so we go to the parent
    return returnIfConditionOrElse(root, parentPath, condition, getPreviousNode);
  }
};

const getLastNode = (root: RootNodeProps, path: number[] | null | undefined): number[] | null => {
  if (!path) return null;
  const node = getNodeProps(root, path);
  if (!node || !node.children || node.children.length === 0) return path;

  const childPath = [...path, node.children.length - 1];
  let childNode = node.children[node.children.length - 1];
  while (childNode.children && childNode.children.length > 0) {
    childPath.push(childNode.children.length - 1);
    childNode = childNode.children[childNode.children.length - 1];
  }
  return childPath;
};

export const getNextNode = (
  root: RootNodeProps,
  path: number[] | null | undefined,
  condition?: (props: NodeProps) => boolean
): number[] | null => {
  if (!path) return null;
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNodeProps(root, parentPath);

  if (!parent || !parent.children) {
    log.debug('No parent or no children', { parent, children: parent?.children });
    return null;
  }

  const index = path.at(-1)!;
  const node = parent.children[index];
  if (!node) {
    log.debug('No node at index', { index, parent });
    return null;
  }

  // If the node has children, we need to go to the first child
  if (node.children && node.children!.length > 0) {
    return returnIfConditionOrElse(root, [...path, 0], condition, getNextNode);
  } else if (index < parent.children.length - 1) {
    // If it is not the last node in the parent, we can just go to the next node
    return returnIfConditionOrElse(root, [...parentPath, index + 1], condition, getNextNode);
  } else {
    // We are at the very bottom and there are no parents further up and no next nodes
    if (parentPath.length === 0) {
      log.debug("Reached last node, can't go further");
      return null;
    }

    // We go up until we find a parent that has a next node. Then we go to that node and return it as the next node
    let pathToInvestigate = parentPath;
    // The next path is the parent path with the last index increased by one
    let nextPathOfPathToInvestigate: number[] | null = [
      ...parentPath.slice(0, parentPath.length - 1),
      parentPath.at(-1)! + 1,
    ];
    // Check if the next node exists
    let nextNodeOfPathToInvestigate = getNodeProps(root, nextPathOfPathToInvestigate);
    // If the next node does not exist, we go up one level and check again until we find a node, or we are at the top
    while (nextNodeOfPathToInvestigate === null && pathToInvestigate.length > 0) {
      // Remove the last index of the path, thereby getting the parent path
      pathToInvestigate = pathToInvestigate.slice(0, pathToInvestigate.length - 1);
      // The next path is the parent path with the last index increased by one
      nextPathOfPathToInvestigate = [
        ...pathToInvestigate.slice(0, pathToInvestigate.length - 1),
        pathToInvestigate.at(-1)! + 1,
      ];
      // Check if the next node exists
      nextNodeOfPathToInvestigate = getNodeProps(root, nextPathOfPathToInvestigate);
    }
    return returnIfConditionOrElse(root, nextPathOfPathToInvestigate, condition, getNextNode);
  }
};

/**
 * Returns the next node to insert a node into.
 * @param root The root node
 * @param path The path to the node to insert into
 * @param descriptions The node descriptions
 * @param condition An optional condition that the node must fulfill
 */
export const getNextNodeToInsert = (
  root: RootNodeProps,
  path: number[] | null | undefined,
  descriptions: NodeDescriptions,
  condition?: (props: NodeProps) => boolean
): number[] | null => {
  if (path === null || path === undefined) return null;

  let nextNode = getNextNode(root, path, condition);
  let nodeProps = getNodeProps(root, nextNode);
  while (nodeProps && nodeProps.children && nodeProps.children.length > 0) {
    const nodeCaps = getNodeCapabilities(nodeProps, descriptions);
    // We have found a node that can have children and is not immutable, therefore we can insert into it and it is the next node
    if (nodeCaps.canHaveChildren && !nodeCaps.immutableChildren) break;
    nodeProps = getNodeProps(root, nextNode);
    nextNode = getNextNode(root, nextNode);
  }

  // There does not seem to be a next node which is deeper nested, or at the same leve, therefore we have to look if the
  // parent of the *path* has some siblings where we can insert into.
  if (nextNode === null) {
    const parentPath = getParentNode(root, path, descriptions, undefined);
    if (!parentPath || parentPath.length === 0) return null;
    // Get the closest non-structural grand-parent node
    const grandParentPath = getParentNode(root, parentPath, descriptions, (desc) => {
      return 'immutableChildren' in desc && !desc.immutableChildren;
    });
    const grandParent = getNodeProps(root, grandParentPath);
    if (!grandParent) return null;

    // and then increase the index of the node th child is in by one
    nextNode = [...grandParentPath!, path.at(grandParentPath!.length)! + 1];
  }

  return nextNode;
};

export const getNodeProps = (root: RootNodeProps, path: number[] | null | undefined): NodeProps | null => {
  if (!path) {
    return null;
  }
  let stateIterator: NodeProps = root;
  for (const key of path) {
    if (!stateIterator || !stateIterator.children) return null;
    stateIterator = stateIterator.children[key];
  }
  return stateIterator ?? null;
};

export const updateChildren = (
  editorState: RootNodeProps,
  path: number[],
  action: (children: NodeProps[], parent: NodeProps) => void
): RootNodeProps => {
  const newState = { ...editorState };
  let stateIterator: NodeProps | RootNodeProps = newState;

  for (let key of path) {
    // Create children if they do not already exist
    if (!stateIterator.children) {
      stateIterator.children = [];
    }

    // If the key is larger than the children array, we set it to the last index
    if (key > stateIterator.children.length) {
      log.warn('Index is larger than the children array. This is probably a bug.', path, stateIterator);
      key = stateIterator.children.length;
    }

    // We are not at the end of the chain, therefore we need to go deeper
    stateIterator.children = [...stateIterator.children];
    stateIterator.children[key] = { ...stateIterator.children[key] };
    stateIterator = stateIterator.children[key];
  }
  if (!stateIterator.children) stateIterator.children = [];
  else stateIterator.children = [...stateIterator.children];
  action(stateIterator.children, stateIterator);

  return newState;
};

const sortPaths = (paths: number[][]): number[][] => {
  return paths.sort((a, b) => {
    if (a.length > b.length) return 1;
    if (a.length < b.length) return -1;
    for (let i = 0; i < a.length; i++) {
      if (a[i] > b[i]) return 1;
      if (a[i] < b[i]) return -1;
    }
    return 0;
  });
};

/**
 * Takes an array of paths and determines the last path
 * @param paths The paths to sort
 * @returns The last path or null if the array is empty
 */
export const getLastPath = (paths: number[][] | null | undefined): number[] | null => {
  if (!paths) return null;
  const sorted = sortPaths(paths);
  return sorted.at(-1) ?? null;
};

/**
 * Takes an array of paths and determines the first path
 * @param paths The paths to sort
 * @returns The first path or null if the array is empty
 */
export const getFirstPath = (paths: number[][] | null | undefined): number[] | null => {
  if (!paths) return null;
  const sorted = sortPaths(paths);
  return sorted.at(0) ?? null;
};

export const getNodesInRange = (root: RootNodeProps, origin: number[], range: number): number[][] => {
  const nodes: number[][] = [origin];
  let currentPath: number[] | null = origin;
  while (currentPath && range !== 0) {
    if (range < 0) {
      currentPath = getPreviousNode(root, currentPath);
      range++;
    } else {
      currentPath = getNextNode(root, currentPath);
      range--;
    }
    if (currentPath) nodes.push(currentPath);
  }
  return nodes;
};

export const getNodeOffsetBy = (
  root: RootNodeProps,
  path: number[],
  offset: number,
  condition?: (props: NodeProps) => boolean
): number[] | null => {
  if (offset === 0) return path;
  while (offset !== 0) {
    if (offset < 0) {
      path = getPreviousNode(root, path, condition) ?? path;
      offset++;
    } else {
      path = getNextNode(root, path, condition) ?? path;
      offset--;
    }
  }
  return path;
};

export const getNodeRange = (root: RootNodeProps, origin: number[], range: number): [number[], NodeProps][] => {
  const nodes = getNodesInRange(root, origin, range);

  // Get the node which is the furthest up in the tree
  const firstPath = getFirstPath(nodes)!;

  // Check if there are nodes which are on the same level as the first node
  const sameLevelNodes = nodes.filter((node) => node.length === firstPath?.length);

  // We are only concerned with the nodes which are on the same level as the first node, as the other ones are
  // children of these sameLevelNodes
  return sameLevelNodes.map((node) => [node, getNodeProps(root, node)!]);
};

export const deleteRange = (root: RootNodeProps, origin: number[], range: number): RootNodeProps => {
  // Get the nodes which should be removed
  const nodes = getNodeRange(root, origin, range).map(([path]) => path);
  if (nodes.length === 0) return root;
  const parentPath = nodes[0].slice(0, -1);

  return updateChildren(root, parentPath, (children) => {
    const deleteCount = nodes.length;
    const deleteIndex = nodes[0].at(-1)!;
    children.splice(deleteIndex, deleteCount);
  });
};

export const equalPaths = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

export const sameParent = (a: number[], b: number[]): boolean => {
  if (a.length !== b.length) return false;
  if (a.length === 0) return true;
  const parentA = a.slice(0, -1);
  const parentB = b.slice(0, -1);
  return equalPaths(parentA, parentB);
};

export const isChildOf = (a: number[], b: number[], direct = false): boolean => {
  // If "a" is the child of "b", then "a" has to be longer than "b"
  if (a.length <= b.length) return false;

  // Get parent of "a"
  const parentA = a.slice(0, -1);
  if (direct) return equalPaths(parentA, b);

  // Check if the parent of "a" is a child of "b"
  return isChildOf(parentA, b, false);
};

export const deepFreeze = <T>(obj: T): T => {
  // Retrieve the property names defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = (obj as any)[name];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
};

export const getNodeCapabilities = (node: NodeProps, descriptions: NodeDescriptions): NodeCapabilities => {
  const nodeCapabilities = descriptions.find((n) => n.id === node.id)?.capabilities;
  if (!nodeCapabilities) {
    log.error(`Node with id ${node.id} does not exist in the node descriptions`, { node, nodes: descriptions });
    throw new Error(`Node with id "${node.id}" does not exist in the node descriptions`);
  }
  return nodeCapabilities;
};

export const getSibling = (root: RootNodeProps, path: number[], offset: number): number[] | null => {
  const parent = path.slice(0, -1);
  const parentNode = getNodeProps(root, parent);
  if (parentNode === null) return null;
  const index = path.at(-1)!;
  const siblingIndex = index + offset;
  if (siblingIndex < 0 || siblingIndex >= parentNode.children!.length) return null;
  return [...parent, siblingIndex];
};

export const getParentNode = (
  root: RootNodeProps,
  path: number[],
  descriptions: NodeDescriptions,
  condition: ((description: NodeCapabilities) => boolean) | undefined
): number[] | null => {
  let parentPath = path.slice(0, -1);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const props = getNodeProps(root, parentPath)!;
    const description = getNodeCapabilities(props, descriptions);
    // We have found a parent which matches the condition
    if (!condition || condition(description)) return parentPath;

    // We have reached the root node
    if (parentPath.length === 0) return null;
    parentPath = parentPath.slice(0, -1);
  }
};
