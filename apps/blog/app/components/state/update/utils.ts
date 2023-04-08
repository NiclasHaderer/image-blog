import { PanelProps, RootPanelProps } from '../editor-state';

export const getPreviousNode = (root: RootPanelProps, path: number[] | null | undefined): number[] | null => {
  if (!path) return null;
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNode(root, parentPath);

  if (!parent || !parent.children) {
    console.warn('No node found for path', path);
    return null;
  }
  const index = path.at(-1)!;
  if (index > 0) {
    return [...parentPath, index - 1];
  } else {
    if (parentPath.length === 0) {
      return null;
    }
    return parentPath;
  }
};

export const getNode = (root: RootPanelProps, path: number[] | null | undefined): PanelProps | null => {
  if (!path) return null;
  let stateIterator: PanelProps = root;
  for (const key of path) {
    if (!stateIterator.children) {
      console.warn('No children found for path', path);
      return null;
    }
    stateIterator = stateIterator.children[key];
  }
  return stateIterator;
};

export const getNextNode = (root: RootPanelProps, path: number[] | null | undefined): number[] | null => {
  if (!path) return null;
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNode(root, parentPath);

  if (!parent || !parent.children) {
    console.warn('No node found for path', path);
    return null;
  }

  const index = path.at(-1)!;
  if (index < parent.children.length - 1) {
    return [...parentPath, index + 1];
  } else {
    if (parentPath.length === 0) {
      return null;
    }
    // We are in the last node of this parent, so we need to go to the next node in the parent
    return getNextNode(root, parentPath);
  }
};

export const updateChildren = (
  editorState: RootPanelProps,
  path: number[],
  action: (children: PanelProps[]) => void
): RootPanelProps => {
  const newState = { ...editorState };
  let stateIterator: PanelProps | RootPanelProps = newState;

  if (path.length === 0) {
    if (!stateIterator.children) stateIterator.children = [];
    else stateIterator.children = [...stateIterator.children];
    action(stateIterator.children);
    return newState;
  }

  for (let [index, key] of path.entries()) {
    // Create children if they do not already exist
    if (!stateIterator.children) {
      stateIterator.children = [];
    }

    // If the key is larger than the children array, we set it to the last index
    if (key > stateIterator.children.length) {
      console.warn('Index is larger than the children array. This is probably a bug.', path, stateIterator);
      key = stateIterator.children.length;
    }

    // We are at the end of the chain, therefore we can set the new data
    const isLast = index === path.length - 1;
    stateIterator.children = [...stateIterator.children];
    if (isLast) {
      action(stateIterator.children);
    } else {
      // We are not at the end of the chain, therefore we need to go deeper
      stateIterator = { ...stateIterator.children[key] };
    }
  }
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

export const getLastPath = (paths: number[][] | null | undefined): number[] | null => {
  if (!paths) return null;
  const sorted = sortPaths(paths);
  return sorted.at(-1)! ?? null;
};

export const getFirstPath = (paths: number[][] | null | undefined): number[] | null => {
  if (!paths) return null;
  const sorted = sortPaths(paths);
  return sorted.at(0)! ?? null;
};

export const getNodesInRange = (root: RootPanelProps, origin: number[], range: number): number[][] => {
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

export const getNodeOffsetBy = (root: RootPanelProps, path: number[], offset: number): number[] | null => {
  if (offset === 0) return path;
  while (offset !== 0) {
    if (offset < 0) {
      path = getPreviousNode(root, path) ?? path;
      offset++;
    } else {
      path = getNextNode(root, path) ?? path;
      offset--;
    }
  }
  return path;
};

export const getPanelRange = (root: RootPanelProps, origin: number[], range: number): [number[], PanelProps][] => {
  const nodes = getNodesInRange(root, origin, range);

  // Get the node which is the furthest up in the tree
  const firstPath = getFirstPath(nodes)!;

  // Check if there are nodes which are on the same level as the first node
  const sameLevelNodes = nodes.filter((node) => node.length === firstPath?.length);

  // We are only concerned with the nodes which are on the same level as the first node, as the other ones are
  // children of these sameLevelNodes

  return sameLevelNodes.map((node) => [node, getNode(root, node)!]);
};

export const deleteRange = (root: RootPanelProps, origin: number[], range: number): RootPanelProps => {
  // Get the nodes which should be removed
  const nodes = getPanelRange(root, origin, range).map(([path]) => path);
  if (nodes.length === 0) return root;
  const parentPath = nodes[0].slice(0, -1);

  return updateChildren(root, parentPath, (children) => {
    const deleteCount = nodes.length;
    const deleteIndex = nodes[0].at(-1)!;
    children.splice(deleteIndex, deleteCount);
  });
};
