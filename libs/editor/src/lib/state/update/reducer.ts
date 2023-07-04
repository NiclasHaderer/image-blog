import { NodeProps, RootNodeProps } from '../editor-state';
import { focus, focusNext, focusPrevious, outerFocus, outerFocusNext, outerFocusPrevious } from './focus';
import { addNode, deleteNode, replaceNode } from './nodes';
import { moveOuterFocusedDown, moveOuterFocusedUp } from './move';
import { deepFreeze, deleteRange } from './utils';
import { logger } from '../../logger';
import { EMPTY_CONTROL_NODE } from '../../nodes/empty-control-node';

const log = logger('reducer');

type InitAction = {
  type: 'init';
  origin: [];
  payload: undefined;
};

type ReplaceAction = {
  type: 'replace';
  origin: number[];
  payload: {
    at: number[];
    with: NodeProps;
  };
};

type ReplaceRootAction = {
  type: 'replace-root';
  origin: number[];
  payload: {
    with: RootNodeProps;
    skipHistory: boolean;
  };
};

type CreateAction = {
  type: 'add';
  origin: number[];
  payload: {
    at: number[];
    node: NodeProps;
  };
};

type DeleteAction = {
  type: 'delete';
  origin: number[];
  payload:
    | {
        at: number[];
      }
    | { selection: true };
};

type FocusNextAction = {
  type: 'focus-next';
  origin: number[];
  payload: { force: boolean };
};

type FocusPreviousAction = {
  type: 'focus-previous';
  origin: number[];
  payload: { force: boolean };
};

type FocusAction = {
  type: 'focus';
  origin: number[];
  payload: {
    at: number[];
    force: boolean;
  };
};

type OuterFocusAction = {
  type: 'outer-focus';
  origin: number[];
  payload: {
    at: number[];
  };
};

type OuterFocusNextAction = {
  type: 'outer-focus-next';
  origin: number[];
  payload: { mode: 'add' | 'replace' };
};

type OuterFocusPreviousAction = {
  type: 'outer-focus-previous';
  origin: number[];
  payload: { mode: 'add' | 'replace' };
};

type MoveOuterFocusedDownAction = {
  type: 'move-outer-focused-down';
  origin: number[];
  payload: null;
};

type MoveOuterFocusedUpAction = {
  type: 'move-outer-focused-up';
  origin: number[];
  payload: null;
};

export type EditorAction<T> = { type: string; origin: number[]; payload: T };
export type EditorActions =
  | InitAction
  | ReplaceAction
  | ReplaceRootAction
  | CreateAction
  | DeleteAction
  | FocusNextAction
  | FocusPreviousAction
  | FocusAction
  | OuterFocusAction
  | OuterFocusNextAction
  | OuterFocusPreviousAction
  | MoveOuterFocusedDownAction
  | MoveOuterFocusedUpAction;

export const editorReducer = (state: RootNodeProps, { payload, type, origin }: EditorActions): RootNodeProps => {
  // Check if we are in dev mode
  if (process.env.NODE_ENV === 'development') {
    // Deep Freeze the state to prevent mutations
    deepFreeze(state);
  }
  let newState: RootNodeProps | null = null;
  // eslint-disable-next-line no-console
  log.group({ type, payload, origin });
  switch (type) {
    case 'replace': {
      newState = replaceNode(state, payload.at, payload.with);
      break;
    }
    case 'replace-root': {
      newState = { ...payload.with };
      break;
    }
    case 'add': {
      newState = addNode(state, payload.at, 'after', payload.node);
      break;
    }
    case 'delete': {
      if ('selection' in payload) {
        if (state.outerFocusedNode === null || state.outerFocusedRange === null) {
          newState = state;
          break;
        }
        newState = outerFocusPrevious(state, 'replace');
        newState = deleteRange(newState, state.outerFocusedNode, state.outerFocusedRange);
      } else {
        if (payload.at.join('') === state.focusedNode?.join('')) {
          newState = focusPrevious(state, true);
        }
        newState = deleteNode(newState ?? state, payload.at);
      }
      break;
    }
    case 'focus-next': {
      newState = focusNext(state, payload.force);
      break;
    }
    case 'focus-previous': {
      newState = focusPrevious(state, payload.force);
      break;
    }
    case 'focus': {
      newState = focus(state, payload.at, payload.force);
      break;
    }
    case 'outer-focus': {
      newState = outerFocus(state, payload.at);
      break;
    }
    case 'outer-focus-next': {
      newState = outerFocusNext(state, payload.mode);
      break;
    }
    case 'outer-focus-previous': {
      newState = outerFocusPrevious(state, payload.mode);
      break;
    }
    case 'move-outer-focused-down': {
      newState = moveOuterFocusedDown(state);
      break;
    }
    case 'move-outer-focused-up': {
      newState = moveOuterFocusedUp(state);
      break;
    }
    case 'init': {
      newState = state;
    }
  }

  // If there are no children add a ControlNode to the root
  // noinspection JSObjectNullOrUndefined
  if (newState.children?.length === 0) {
    newState.children = [EMPTY_CONTROL_NODE];
    newState = focus(newState, [0], true);
  }
  log.groupEnd();
  return newState;
};
