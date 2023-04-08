import { RootPanelProps } from '../editor-state';
import { getPanelRange } from './utils';

export const moveOuterFocusedDown = (editorState: RootPanelProps): RootPanelProps => {
  // Check if we have an outer focused node
  const outerFocused = editorState.outerFocusedNode;
  if (!outerFocused) return editorState;

  // Get the range that is focused
  const focusRange = editorState.outerFocusedRange ?? 0;

  const panelsToMove = getPanelRange(editorState, outerFocused, focusRange);
  // TODO add the panels one below the last one which is in the panelsToMove
  // TODO remove the panels from their previous position
  // TODO update the outerFocusedNode and outerFocusedRange
  return editorState;
};
