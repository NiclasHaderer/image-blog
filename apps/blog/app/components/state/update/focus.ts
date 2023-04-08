import { RootPanelProps } from '../editor-state';
import { getNextNode, getNodeOffsetBy, getPreviousNode } from './utils';

export const outerFocus = (state: RootPanelProps, path: number[]): RootPanelProps => {
  return {
    ...state,
    outerFocusedNode: path,
    focusedNode: null,
    forceFocus: false,
    outerFocusedRange: 0,
  };
};

export const outerFocusNext = (state: RootPanelProps, mode: 'add' | 'replace'): RootPanelProps => {
  if (!state.outerFocusedNode) {
    console.warn("No outer focused node, can't focus previous");
    return state;
  }

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

export const outerFocusPrevious = (state: RootPanelProps, mode: 'add' | 'replace'): RootPanelProps => {
  if (!state.outerFocusedNode) {
    console.warn("No outer focused node, can't focus previous");
    return state;
  }

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

export const focus = (state: RootPanelProps, path: number[], force: boolean): RootPanelProps => {
  return {
    ...state,
    focusedNode: path,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};

export const focusPrevious = (state: RootPanelProps, force: boolean): RootPanelProps => {
  const reference = state.focusedNode || state.outerFocusedNode;
  const previousNode = getPreviousNode(state, reference);
  if (!previousNode) return state;
  return {
    ...state,
    focusedNode: previousNode,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};

export const focusNext = (state: RootPanelProps, force: boolean): RootPanelProps => {
  const reference = state.focusedNode || state.outerFocusedNode;
  const nextNode = getNextNode(state, reference);
  if (!nextNode) return state;
  return {
    ...state,
    focusedNode: nextNode,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};
