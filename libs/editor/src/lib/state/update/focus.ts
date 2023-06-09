import { RootNodeProps } from '../editor-state';
import { getNextNode, getNodeOffsetBy, getNodeProps, getPreviousNode, isChildOf } from './utils';
import { logger } from '../../logger';

const log = logger('focus');

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
  if (!state.outerFocusedNode) {
    log.debug('outerFocusNext: no outerFocusedNode');
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
    const nextNode = getNodeOffsetBy(
      state,
      state.outerFocusedNode,
      nodeFocusRange,
      (props) => !props.capabilities.structural
    );
    if (!nextNode) {
      log.debug('outerFocusNext: no nextNode');
      return state;
    }
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
  if (!state.outerFocusedNode) {
    log.debug('outerFocusPrevious: no outerFocusedNode');
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
    const previousNode = getNodeOffsetBy(
      state,
      state.outerFocusedNode,
      nodeFocusRange,
      (props) => !props.capabilities.structural
    );
    if (!previousNode) {
      log.debug('outerFocusPrevious: no previousNode');
      return state;
    }
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
  // Check if node can be focused
  const nodeProps = getNodeProps(state, path);
  if (!nodeProps) {
    log.debug('focus: node does not exit', { path, state });
    return state;
  }

  // If the node cannot be focused, focus the next focusable child
  if (!nodeProps.capabilities.canBeInnerFocused) {
    log.debug('focus: node can not be focused, focusing next focusable child', { path, state });
    const nextFocusableChild = getNextNode(
      state,
      path,
      (props) => !props.capabilities.structural && props.capabilities.canBeInnerFocused
    );

    // If there is no next focusable child, do nothing
    if (!nextFocusableChild) {
      log.debug('focus: no next focusable child', { path, state });
      return state;
    }

    // If the next focusable element is not a child of the node, do nothing
    if (isChildOf(path, nextFocusableChild)) {
      log.debug('focus: next focusable child is a child of the node', { path, state });
      return state;
    }

    log.debug('focus: focusing next focusable child', { path, state });
    // Focus the next focusable child
    path = nextFocusableChild;
  }

  return {
    ...state,
    focusedNode: path,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};

export const focusPrevious = (state: RootNodeProps, force: boolean): RootNodeProps => {
  const reference = state.focusedNode;
  if (!reference) {
    log.debug('focusPrevious: no node focused');
    return state;
  }

  const previousNode = getPreviousNode(
    state,
    reference,
    (props) => !props.capabilities.structural && props.capabilities.canBeInnerFocused
  );
  if (!previousNode) {
    log.debug('focusPrevious: no previousNode');
    return state;
  }

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
  const nextNode = getNextNode(
    state,
    reference,
    (props) => !props.capabilities.structural && props.capabilities.canBeInnerFocused
  );
  if (!nextNode) {
    log.debug('focusNext: no nextNode');
    return state;
  }
  return {
    ...state,
    focusedNode: nextNode,
    outerFocusedNode: null,
    forceFocus: force,
    outerFocusedRange: null,
  };
};
