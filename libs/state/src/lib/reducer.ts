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
import { logger, RootNodeProps } from '@image-blog/shared';
import { EditorActions } from './actions';

const log = logger('reducer');

export const editorReducer = (state: RootNodeProps, { payload, type, origin }: EditorActions): RootNodeProps => {
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
