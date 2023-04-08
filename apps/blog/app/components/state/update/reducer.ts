import { PanelProps, RootPanelProps } from '../editor-state';
import { ControlPanel } from '../../panels/control-panel';
import { focus, focusNext, focusPrevious, outerFocus, outerFocusNext, outerFocusPrevious } from './focus';
import { addPanel, deletePanel, replacePanel } from './state';
import { moveOuterFocusedDown, moveOuterFocusedUp } from './move';

type ReplaceAction = {
  type: 'replace';
  origin: number[];
  payload: {
    at: number[];
    with: PanelProps;
  };
};

type CreateAction = {
  type: 'add';
  origin: number[];
  payload: {
    at: number[];
    panel: PanelProps;
  };
};

type DeleteAction = {
  type: 'delete';
  origin: number[];
  payload: {
    at: number[];
  };
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
  | ReplaceAction
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

export const editorReducer = (state: RootPanelProps, { origin, payload, type }: EditorActions) => {
  console.log(type, payload);
  let newState: RootPanelProps;
  switch (type) {
    case 'replace': {
      newState = replacePanel(state, payload.at, payload.with);
      break;
    }
    case 'add': {
      newState = addPanel(state, payload.at, 'after', payload.panel);
      break;
    }
    case 'delete': {
      newState = deletePanel(state, payload.at);
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
  }

  // If there are no children add a ControlPanel to the root
  if (newState.children?.length === 0) {
    newState.children = [ControlPanel.empty()];
  }
  return newState;
};
