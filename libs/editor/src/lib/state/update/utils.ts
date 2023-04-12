import { NodeProps, RootNodeProps } from '../editor-state';

const returnIfStructuralOrElse = (
  root: RootNodeProps,
  path: number[] | null | undefined,
  scipStructural: boolean,
  callback: (root: RootNodeProps, path: number[], scipStructural: boolean) => number[] | null
): number[] | null => {
  if (!path) return null;
  const node = getNodeProps(root, path);
  if (!node) return null;
  if (scipStructural && node.capabilities.structural) {
    return callback(root, path, scipStructural);
  } else {
    return path;
  }
};

export const getPreviousNode = (
  root: RootNodeProps,
  path: number[] | null | undefined,
  scipStructural: boolean
): number[] | null => {
  if (!path) return null;
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNodeProps(root, parentPath);

  if (!parent || !parent.children) return null;

  const index = path.at(-1)!;
  // If it is not the last node in the parent, we can just go to the previous node
  if (index > 0) {
    const lastNode = getLastNode(root, [...parentPath, index - 1]);
    return returnIfStructuralOrElse(root, lastNode, scipStructural, getPreviousNode);
  } else {
    // We are at the very top and there are no parents further up and no previous nodes
    if (parentPath.length === 0) {
      return null;
    }

    // We are the first node of this parent, so we go to the parent
    return returnIfStructuralOrElse(root, parentPath, scipStructural, getPreviousNode);
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
  scipStructural: boolean
): number[] | null => {
  if (!path) return null;
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNodeProps(root, parentPath);

  if (!parent || !parent.children) return null;

  const index = path.at(-1)!;
  const node = parent.children[index];
  if (!node) return null;

  // If the node has children, we need to go to the first child
  if (node.children && node.children!.length > 0) {
    return returnIfStructuralOrElse(root, [...path, 0], scipStructural, getNextNode);
  } else if (index < parent.children.length - 1) {
    // If it is not the last node in the parent, we can just go to the next node
    return returnIfStructuralOrElse(root, [...parentPath, index + 1], scipStructural, getNextNode);
  } else {
    // We are at the very top and there are no parents further up and no next nodes
    if (parentPath.length === 0) {
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
    return returnIfStructuralOrElse(root, nextPathOfPathToInvestigate, scipStructural, getNextNode);
  }
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
  action: (children: NodeProps[]) => void
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
      console.warn('Index is larger than the children array. This is probably a bug.', path, stateIterator);
      key = stateIterator.children.length;
    }

    // We are not at the end of the chain, therefore we need to go deeper
    stateIterator.children = [...stateIterator.children];
    stateIterator.children[key] = { ...stateIterator.children[key] };
    stateIterator = stateIterator.children[key];
  }
  if (!stateIterator.children) stateIterator.children = [];
  else stateIterator.children = [...stateIterator.children];
  action(stateIterator.children);

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
      currentPath = getPreviousNode(root, currentPath, false);
      range++;
    } else {
      currentPath = getNextNode(root, currentPath, false);
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
  scipStructural: boolean
): number[] | null => {
  if (offset === 0) return path;
  while (offset !== 0) {
    if (offset < 0) {
      path = getPreviousNode(root, path, scipStructural) ?? path;
      offset++;
    } else {
      path = getNextNode(root, path, scipStructural) ?? path;
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
