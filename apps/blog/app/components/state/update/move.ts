import { RootPanelProps } from '../editor-state';
import { deleteRange, getFirstPath, getLastPath, getNextNode, getPanelRange, getPreviousNode } from './utils';
import { addPanel } from './state';

export const moveOuterFocusedDown = (editorState: RootPanelProps): RootPanelProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange ?? 0;

  // Find the panels which should be moved. This will only return the panels which are at the top level of the move
  // operation. The children will berefore be moved with the parent.
  const panelsToMove = getPanelRange(editorState, outerFocused, focusRange);
  const panelPositions = panelsToMove.map(([path]) => path);

  // Find the next panel of the last selected panel. This will be the destination of the move operation.
  const lastPath = getLastPath(panelPositions)!;
  const destination = getNextNode(editorState, lastPath);
  if (!destination) return editorState;

  // Add the panels to the new position and delete the old ones
  editorState = addPanel(editorState, destination, 'after', ...panelsToMove.map(([, panel]) => panel));
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

export const moveOuterFocusedUp = (editorState: RootPanelProps): RootPanelProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange ?? 0;

  // Find the panels which should be moved. This will only return the panels which are at the top level of the move
  // operation. The children will berefore be moved with the parent.
  const panelsToMove = getPanelRange(editorState, outerFocused, focusRange);
  const panelPositions = panelsToMove.map(([path]) => path);

  // Find the previous panel of the first selected panel. This will be the destination of the move operation.
  const lastPath = getFirstPath(panelPositions)!;
  const destination = getPreviousNode(editorState, lastPath);
  if (!destination) return editorState;

  // Delete the panels from the old position and then add them to the new position
  editorState = deleteRange(editorState, outerFocused, focusRange);
  editorState = addPanel(editorState, destination, 'before', ...panelsToMove.map(([, panel]) => panel));

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
