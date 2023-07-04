import { NodeProps, RootNodeProps } from '@image-blog/common';

export type InitAction = {
  type: 'init';
  origin: [];
  payload: undefined;
};

export type ReplaceAction = {
  type: 'replace';
  origin: number[];
  payload: {
    at: number[];
    with: NodeProps;
  };
};

export type ReplaceRootAction = {
  type: 'replace-root';
  origin: number[];
  payload: {
    with: RootNodeProps;
    skipHistory: boolean;
  };
};

export type CreateAction = {
  type: 'add';
  origin: number[];
  payload: {
    at: number[];
    node: NodeProps;
  };
};

export type DeleteAction = {
  type: 'delete';
  origin: number[];
  payload:
    | {
        at: number[];
      }
    | { selection: true };
};

export type FocusNextAction = {
  type: 'focus-next';
  origin: number[];
  payload: { force: boolean };
};

export type FocusPreviousAction = {
  type: 'focus-previous';
  origin: number[];
  payload: { force: boolean };
};

export type FocusAction = {
  type: 'focus';
  origin: number[];
  payload: {
    at: number[];
    force: boolean;
  };
};

export type OuterFocusAction = {
  type: 'outer-focus';
  origin: number[];
  payload: {
    at: number[];
  };
};

export type OuterFocusNextAction = {
  type: 'outer-focus-next';
  origin: number[];
  payload: { mode: 'add' | 'replace' };
};

export type OuterFocusPreviousAction = {
  type: 'outer-focus-previous';
  origin: number[];
  payload: { mode: 'add' | 'replace' };
};

export type MoveOuterFocusedDownAction = {
  type: 'move-outer-focused-down';
  origin: number[];
  payload: null;
};

export type MoveOuterFocusedUpAction = {
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
