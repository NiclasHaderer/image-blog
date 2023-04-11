import { RootNodeProps } from '../editor-state';
import { getNextNode, getNodeOffsetBy, getPreviousNode } from './utils';

export const outerFocus = (state: RootNodeProps, path: number[]): RootNodeProps => {
  return {
    ...state,
    outerFocusedNode: path,
    focusedNode: null,
    forceFocus: false,
    outerFocusedRange: 0,
  };
};

export const outerFocusNext = (state: RootNodeProps, mode: 'add' | 'replace'): RootNodeProps => {
  if (!state.outerFocusedNode) return state;

  const nodeFocusRange = state.outerFocusedRange ? state.outerFocusedRange + 1 : 1;
  if (mode === 'add') {
    return {
      ...state,
      focusedNode: null,
      forceFocus: false,
      outerFocusedRange: nodeFocusRange,
    };
  } else {
    const nextNode = getNodeOffsetBy(state, state.outerFocusedNode, nodeFocusRange);
    if (!nextNode) return state;
    return {
      ...state,
      outerFocusedNode: nextNode,
      focusedNode: null,
      forceFocus: false,
      outerFocusedRange: 0,
    };
  }
};

export const outerFocusPrevious = (state: RootNodeProps, mode: 'add' | 'replace'): RootNodeProps => {
  if (!state.outerFocusedNode) return state;

  const nodeFocusRange = state.outerFocusedRange ? state.outerFocusedRange - 1 : -1;
  if (mode === 'add') {
    return {
      ...state,
      focusedNode: null,
      forceFocus: false,
      outerFocusedRange: nodeFocusRange,
    };
  } else {
    const previousNode = getNodeOffsetBy(state, state.outerFocusedNode, nodeFocusRange);
    if (!previousNode) return state;
    return {
      ...state,
      outerFocusedNode: previousNode,
      focusedNode: null,
      forceFocus: false,
      outerFocusedRange: 0,
    };
  }
};

export const focus = (state: RootNodeProps, path: number[], force: boolean): RootNodeProps => {
  return {
    ...state,
    focusedNode: path,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};

export const focusPrevious = (state: RootNodeProps, force: boolean): RootNodeProps => {
  const reference = state.focusedNode || state.outerFocusedNode;
  const previousNode = getPreviousNode(state, reference, true);
  if (!previousNode) return state;
  return {
    ...state,
    focusedNode: previousNode,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};

export const focusNext = (state: RootNodeProps, force: boolean): RootNodeProps => {
  const reference = state.focusedNode || state.outerFocusedNode;
  const nextNode = getNextNode(state, reference, true);
  if (!nextNode) return state;
  return {
    ...state,
    focusedNode: nextNode,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};
