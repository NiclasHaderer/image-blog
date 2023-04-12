import { RootNodeProps } from '../editor-state';
import {
  deleteRange,
  equalPaths,
  getFirstPath,
  getLastPath,
  getNextNode,
  getNodeRange,
  getPreviousNode,
} from './utils';
import { addNode } from './state';

export const moveOuterFocusedDown = (editorState: RootNodeProps): RootNodeProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange ?? 0;

  // Find the nodes which should be moved. This will only return the nodes which are at the top level of the move
  // operation. The children will before be moved with the parent.
  let nodesToMove = getNodeRange(editorState, outerFocused, focusRange);

  // Filter out nodes that can't be deleted on their own
  nodesToMove = nodesToMove.filter(([, props]) => props.capabilities.canBeDeleted);

  const nodePositions = nodesToMove.map(([path]) => path);

  // Find the next node of the last selected node. This will be the destination of the move operation.
  const lastPath = getLastPath(nodePositions)!;
  const destination = getNextNode(editorState, lastPath, true);
  if (!destination) return editorState;

  // Add the nodes to the new position and delete the old ones
  editorState = addNode(editorState, destination, 'after', ...nodesToMove.map(([, node]) => node));
  editorState = deleteRange(editorState, outerFocused, focusRange);

  // Set the focus to the new position
  editorState = {
    ...editorState,
    outerFocusedNode: destination,
    outerFocusedRange: focusRange,
  };

  return editorState;
};

export const moveOuterFocusedUp = (editorState: RootNodeProps): RootNodeProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange ?? 0;

  // Find the nodes which should be moved. This will only return the nodes which are at the top level of the move
  // operation. The children will before be moved with the parent.
  let nodesToMove = getNodeRange(editorState, outerFocused, focusRange);
  // Filter out nodes that can't be deleted on their own
  nodesToMove = nodesToMove.filter(([, props]) => props.capabilities.canBeDeleted);

  const nodePositions = nodesToMove.map(([path]) => path);

  // Find the previous node of the first selected node. This will be the destination of the move operation.
  const lastPath = getFirstPath(nodePositions)!;
  const destination = getPreviousNode(editorState, lastPath, true);
  if (!destination) return editorState;

  // There are different cases for the insertion mode
  const isDeeperToLessDeep = destination.length < outerFocused.length;
  const isLessDeepToDeeper = destination.length > outerFocused.length;

  // 1. We go from a node to a sibling -> insert before
  let insertionMode: 'before' | 'after' = 'before';
  if (isDeeperToLessDeep) {
    // 2. We go from a deeper nested node to a less deeply nested node -> insert before
    insertionMode = 'before';
  } else if (isLessDeepToDeeper) {
    // 3. We go from a less deeply nested node to a deeper nested node -> insert after
    insertionMode = 'after';
  } else if (!equalPaths(destination.slice(0, -1), outerFocused.slice(0, -1))) {
    // 4. We go to a node of the same depth of a different parent -> insert after
    insertionMode = 'after';
  }

  // Delete the nodes from the old position and then add them to the new position
  editorState = deleteRange(editorState, outerFocused, focusRange);
  editorState = addNode(editorState, destination, insertionMode, ...nodesToMove.map(([, node]) => node));

  // Update the outer focused node to the new position
  let newOuterFocused = [...destination];
  if (insertionMode === 'after') {
    newOuterFocused = getNextNode(editorState, destination, true)!;
  }

  // Set the focus to the new position
  editorState = {
    ...editorState,
    outerFocusedNode: newOuterFocused,
    outerFocusedRange: focusRange,
  };

  return editorState;
};
