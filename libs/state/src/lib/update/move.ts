import { logger, NodeDescriptions, RootNodeProps } from '@image-blog/shared';
import {
  deleteRange,
  getFirstPath,
  getLastPath,
  getNextNode,
  getNextNodeToInsert,
  getNodeCapabilities,
  getNodeRange,
  getPreviousNode,
  isParentOf,
  sameParent,
} from './utils';
import { addNode } from './nodes';

const log = logger('move');

export const moveOuterFocusedDown = (editorState: RootNodeProps, descriptions: NodeDescriptions): RootNodeProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange;

  // Find the nodes which should be moved. This will only return the nodes which are at the top level of the move
  // operation. The children will before be moved with the parent.
  let nodesToMove = getNodeRange(editorState, outerFocused, focusRange);

  // Filter out nodes that can't be deleted on their own
  nodesToMove = nodesToMove.filter(([, props]) => getNodeCapabilities(props, descriptions).canBeDeleted);

  const nodePositions = nodesToMove.map(([path]) => path);

  // Find the next node of the last selected node. This will be the destination of the move operation.
  const lastPath = getLastPath(nodePositions)!;
  const destination = getNextNodeToInsert(
    editorState,
    lastPath,
    descriptions,
    (props, path) =>
      !getNodeCapabilities(props, descriptions).structural && !nodePositions.find((n) => isParentOf(n, path))
  );
  if (!destination) {
    log.warn('Could not find a destination for the move operation');
    return editorState;
  }

  // There are different cases for the insertion mode
  const isDeeperToLessDeep = destination.length < outerFocused.length;
  const isLessDeepToDeeper = destination.length > outerFocused.length;

  let insertionMode: 'before' | 'after';
  if (isDeeperToLessDeep) {
    // 1. We go from a deeper nested node to a less deeply nested node -> insert before
    insertionMode = 'before';
  } else if (isLessDeepToDeeper) {
    // 2. We go from a less deeply nested node to a deeper nested node -> insert before
    insertionMode = 'before';
  } else if (!sameParent(destination, outerFocused)) {
    // 3. We go to a node of the same depth of a different parent -> insert before
    insertionMode = 'before';
  } else {
    // 4. We go from a node to a sibling -> insert after
    insertionMode = 'after';
  }

  // Add the nodes to the new position and delete the old ones
  editorState = addNode(
    editorState,
    destination,
    insertionMode,
    nodesToMove.map(([, node]) => node),
    descriptions
  );
  editorState = deleteRange(editorState, outerFocused, focusRange);

  // Update the outer focused node to the new position
  const newOuterFocused = [...destination];

  // Because we are removing nodes from above we have to subtract the length of the nodes from the parent
  if (isLessDeepToDeeper) {
    newOuterFocused[outerFocused.length - 1] -= nodesToMove.length;
  }

  // If we focused from top down and then move up we have to subtract the length of the nodes from the parent
  if (focusRange > 0 && sameParent(destination, outerFocused)) {
    newOuterFocused[newOuterFocused.length - 1] -= nodesToMove.length - 1;
  }

  // If we focused from bottom up and then move down we have to add the length of the nodes to the parent
  if (focusRange < 0 && isLessDeepToDeeper) {
    newOuterFocused[newOuterFocused.length - 1] += nodesToMove.length - 1;
  }

  // We focus from bottom to top and move two or more items outside of node a and inside of node b, which is a sibling of
  // node a
  if (!isLessDeepToDeeper && !isDeeperToLessDeep && focusRange < 0 && !sameParent(destination, outerFocused)) {
    newOuterFocused[newOuterFocused.length - 1] += nodesToMove.length - 1;
  }

  if (isDeeperToLessDeep && focusRange < 0) {
    newOuterFocused[newOuterFocused.length - 1] += nodesToMove.length - 1;
  }

  // Set the focus to the new position
  editorState = {
    ...editorState,
    outerFocusedNode: newOuterFocused,
    outerFocusedRange: focusRange,
  };

  return editorState;
};

export const moveOuterFocusedUp = (editorState: RootNodeProps, descriptions: NodeDescriptions): RootNodeProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) {
    log.info('No outer focused node found. Skipping move up.');
    return editorState;
  }

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange;

  // Find the nodes which should be moved. This will only return the nodes which are at the top level of the move
  // operation. The children will before be moved with the parent.
  let nodesToMove = getNodeRange(editorState, outerFocused, focusRange);
  // Filter out nodes that can't be deleted on their own
  nodesToMove = nodesToMove.filter(([, props]) => getNodeCapabilities(props, descriptions).canBeDeleted);

  const nodePositions = nodesToMove.map(([path]) => path);

  // Find the previous node of the first selected node. This will be the destination of the move operation.
  const lastPath = getFirstPath(nodePositions)!;
  const destination = getPreviousNode(
    editorState,
    lastPath,
    (props) => !getNodeCapabilities(props, descriptions).structural
  );
  if (!destination) {
    log.warn('No destination found. Skipping move up.');
    return editorState;
  }

  // There are different cases for the insertion mode
  const isDeeperToLessDeep = destination.length < outerFocused.length;
  const isLessDeepToDeeper = destination.length > outerFocused.length;

  let insertionMode: 'before' | 'after';
  if (isDeeperToLessDeep) {
    // 1. We go from a deeper nested node to a less deeply nested node -> insert before
    insertionMode = 'before';
  } else if (isLessDeepToDeeper) {
    // 2. We go from a less deeply nested node to a deeper nested node -> insert after
    insertionMode = 'after';
  } else if (!sameParent(destination, outerFocused)) {
    // 3. We go to a node of the same depth of a different parent -> insert after
    insertionMode = 'after';
  } else {
    // 4. We go from a node to a sibling -> insert before
    insertionMode = 'before';
  }

  // Delete the nodes from the old position and then add them to the new position
  editorState = deleteRange(editorState, outerFocused, focusRange);
  editorState = addNode(
    editorState,
    destination,
    insertionMode,
    nodesToMove.map(([, node]) => node),
    descriptions
  );

  // Update the outer focused node to the new position
  let newOuterFocused = [...destination];
  if (insertionMode === 'after') {
    newOuterFocused = getNextNode(
      editorState,
      destination,
      (props) => !getNodeCapabilities(props, descriptions).structural
    )!;
  }

  // The new outer focused node is not necessarily the destination node. If we move multiple nodes and the original focus
  // node is the last node in the list we have to move the focus to it instead of the destination.
  // So we move the focus however many nodes down as our nodesToMove list is long.
  // Because it is guaranteed that the nodes we move are in a flat list we can just add the length of the list to the
  // index of the destination node.
  if (focusRange < 0) {
    newOuterFocused[newOuterFocused.length - 1] += nodesToMove.length - 1;
  }

  // Set the focus to the new position
  editorState = {
    ...editorState,
    outerFocusedNode: newOuterFocused,
    outerFocusedRange: focusRange,
  };

  return editorState;
};
