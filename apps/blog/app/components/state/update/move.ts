import { RootNodeProps } from '../editor-state';
import { deleteRange, getFirstPath, getLastPath, getNextNode, getNodeRange, getPreviousNode } from './utils';
import { addNode } from './state';

export const moveOuterFocusedDown = (editorState: RootNodeProps): RootNodeProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange ?? 0;

  // Find the nodes which should be moved. This will only return the nodes which are at the top level of the move
  // operation. The children will berefore be moved with the parent.
  const nodesToMove = getNodeRange(editorState, outerFocused, focusRange);
  const nodePositions = nodesToMove.map(([path]) => path);

  // Find the next node of the last selected node. This will be the destination of the move operation.
  const lastPath = getLastPath(nodePositions)!;
  const destination = getNextNode(editorState, lastPath);
  if (!destination) return editorState;

  // Add the nodes to the new position and delete the old ones
  editorState = addNode(editorState, destination, 'after', ...nodesToMove.map(([, node]) => node));
  editorState = deleteRange(editorState, outerFocused, focusRange);

  // Update the outer focused node to the new position
  const newOuterFocused = [...outerFocused];
  // We know that the only node index that has changed is the last one of the
  // Therefore we can simply increment it by one
  const parIndex = destination.length - 1;
  newOuterFocused[parIndex] = newOuterFocused[parIndex] + 1;

  // Set the focus to the new position
  editorState = {
    ...editorState,
    outerFocusedNode: newOuterFocused,
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
  // operation. The children will berefore be moved with the parent.
  const nodesToMove = getNodeRange(editorState, outerFocused, focusRange);
  const nodePositions = nodesToMove.map(([path]) => path);

  // Find the previous node of the first selected node. This will be the destination of the move operation.
  const lastPath = getFirstPath(nodePositions)!;
  const destination = getPreviousNode(editorState, lastPath);
  if (!destination) return editorState;

  // Delete the nodes from the old position and then add them to the new position
  editorState = deleteRange(editorState, outerFocused, focusRange);
  editorState = addNode(editorState, destination, 'before', ...nodesToMove.map(([, node]) => node));

  // Update the outer focused node to the new position
  const newOuterFocused = [...outerFocused];
  // We know that the only node index that has changed is the last one of the
  // Therefore we can simply increment it by one
  const parIndex = destination.length - 1;
  newOuterFocused[parIndex] = newOuterFocused[parIndex] - 1;

  // Set the focus to the new position
  editorState = {
    ...editorState,
    outerFocusedNode: newOuterFocused,
    outerFocusedRange: focusRange,
  };

  return editorState;
};
