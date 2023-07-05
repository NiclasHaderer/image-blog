import {
  addNode,
  deepFreeze,
  deleteNode,
  deleteRange,
  focus,
  focusNext,
  focusPrevious,
  moveOuterFocusedDown,
  moveOuterFocusedUp,
  outerFocus,
  outerFocusNext,
  outerFocusPrevious,
  replaceNode,
} from './update';
import { logger, NodeDescriptions, RootNodeProps } from '@image-blog/shared';
import { EditorActions } from './actions';

const log = logger('reducer');

const editorReducer = (
  state: RootNodeProps,
  { payload, type, origin }: EditorActions,
  descriptions: NodeDescriptions
): RootNodeProps => {
  // Check if we are in dev mode
  if (process.env['NODE_ENV'] === 'development') {
    // Deep Freeze the state to prevent mutations
    deepFreeze(state);
  }
  let newState: RootNodeProps | null = null;
  // eslint-disable-next-line no-console
  log.group({ type, payload, origin });
  switch (type) {
    case 'replace': {
      newState = replaceNode(state, payload.at, payload.with, descriptions);
      break;
    }
    case 'replace-root': {
      newState = { ...payload.with };
      break;
    }
    case 'add': {
      newState = addNode(state, payload.at, 'after', [payload.node], descriptions);
      break;
    }
    case 'delete': {
      if ('selection' in payload) {
        if (state.outerFocusedNode === null || state.outerFocusedRange === null) {
          newState = state;
          break;
        }
        newState = outerFocusPrevious(state, 'replace', descriptions);
        newState = deleteRange(newState, state.outerFocusedNode, state.outerFocusedRange);
      } else {
        if (payload.at.join('') === state.focusedNode?.join('')) {
          newState = focusPrevious(state, true, descriptions);
        }
        newState = deleteNode(newState ?? state, payload.at, descriptions);
      }
      break;
    }
    case 'focus-next': {
      newState = focusNext(state, payload.force, descriptions);
      break;
    }
    case 'focus-previous': {
      newState = focusPrevious(state, payload.force, descriptions);
      break;
    }
    case 'focus': {
      newState = focus(state, payload.at, payload.force, descriptions);
      break;
    }
    case 'outer-focus': {
      newState = outerFocus(state, payload.at);
      break;
    }
    case 'outer-focus-next': {
      newState = outerFocusNext(state, payload.mode, descriptions);
      break;
    }
    case 'outer-focus-previous': {
      newState = outerFocusPrevious(state, payload.mode, descriptions);
      break;
    }
    case 'move-outer-focused-down': {
      newState = moveOuterFocusedDown(state, descriptions);
      break;
    }
    case 'move-outer-focused-up': {
      newState = moveOuterFocusedUp(state, descriptions);
      break;
    }
    case 'init': {
      newState = state;
      break;
    }
  }

  // If there are no children add a ControlNode to the root
  // noinspection JSObjectNullOrUndefined
  if (newState.children?.length === 0) {
    log.error('Action would result in an empty root node. Discarding action.', { type, payload, origin });
    newState = state;
  }
  log.groupEnd();
  return newState;
};

export const editorReducerFactory = (descriptions: NodeDescriptions) => {
  return (state: RootNodeProps, action: EditorActions) => {
    return editorReducer(state, action, descriptions);
  };
};
