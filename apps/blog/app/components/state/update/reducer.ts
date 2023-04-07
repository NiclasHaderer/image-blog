import { PanelProps, RootPanelProps } from '../editor-state';
import { ControlPanel } from '../../panels/control-panel';

type ReplaceAction = {
  type: 'replace';
  path: number[];
  payload: PanelProps;
};

type CreateAction = {
  type: 'add';
  path: number[];
  payload: PanelProps;
};

type DeleteAction = {
  type: 'delete';
  path: number[];
  payload: null;
};

type FocusNextAction = {
  type: 'focus-next';
  path: number[];
  payload: { force: boolean; reference: 'currentNode' | 'currentFocus' };
};

type FocusPreviousAction = {
  type: 'focus-previous';
  path: number[];
  payload: { force: boolean; reference: 'currentNode' | 'currentFocus' };
};

type FocusAction = {
  type: 'focus';
  path: number[];
  payload: { force: boolean };
};

type OuterFocusAction = {
  type: 'outer-focus';
  path: number[];
  payload: null;
};

type OuterFocusNextAction = {
  type: 'outer-focus-next';
  path: number[];
  payload: null;
};

type OuterFocusPreviousAction = {
  type: 'outer-focus-previous';
  path: number[];
  payload: null;
};

export type EditorAction<T> = { type: string; path: number[]; payload: T };
export type EditorActions =
  | ReplaceAction
  | CreateAction
  | DeleteAction
  | FocusNextAction
  | FocusPreviousAction
  | FocusAction
  | OuterFocusAction
  | OuterFocusNextAction
  | OuterFocusPreviousAction;

export const editorReducer = (state: RootPanelProps, action: EditorActions) => {
  console.log(action);
  let newState: RootPanelProps;
  switch (action.type) {
    case 'replace': {
      const parentPath = action.path.slice(0, action.path.length - 1);
      newState = updateChildren(state, parentPath, (children) => {
        children[action.path.at(-1)!] = action.payload;
      });
      break;
    }
    case 'add': {
      const parentPath = action.path.slice(0, action.path.length - 1);
      newState = updateChildren(state, parentPath, (children) => {
        children.splice(action.path.at(-1)! + 1, 0, action.payload);
      });
      break;
    }
    case 'delete': {
      const parentPath = action.path.slice(0, action.path.length - 1);
      newState = updateChildren(state, parentPath, (children) => {
        children.splice(action.path[action.path.length - 1], 1);
      });
      break;
    }
    case 'focus-next': {
      const reference =
        action.payload.reference === 'currentNode' ? action.path : state.focusedNode ?? state.outerFocusedNode;
      if (!reference) {
        console.warn("No focused node, can't focus next");
        return state;
      }
      const nextNode = getNextNode(state, reference);
      if (!nextNode) return state;
      newState = {
        ...state,
        focusedNode: nextNode,
        outerFocusedNode: null,
        forceFocus: action.payload.force,
      };
      break;
    }
    case 'focus-previous': {
      const reference =
        action.payload.reference === 'currentNode' ? action.path : state.focusedNode ?? state.outerFocusedNode;
      if (!reference) {
        console.warn("No focused node, can't focus previous");
        return state;
      }
      const previousNode = getPreviousNode(state, reference);
      if (!previousNode) return state;
      newState = {
        ...state,
        focusedNode: previousNode,
        outerFocusedNode: null,
        forceFocus: action.payload.force,
      };
      break;
    }
    case 'focus': {
      newState = {
        ...state,
        focusedNode: action.path,
        outerFocusedNode: null,
        forceFocus: action.payload.force,
      };
      break;
    }
    case 'outer-focus': {
      newState = {
        ...state,
        outerFocusedNode: action.path,
        focusedNode: null,
        forceFocus: false,
      };
      break;
    }
    case 'outer-focus-next': {
      if (!state.outerFocusedNode) {
        console.warn("No outer focused node, can't focus previous");
        return state;
      }
      const nextNode = getNextNode(state, state.outerFocusedNode);
      if (!nextNode) return state;
      newState = {
        ...state,
        outerFocusedNode: nextNode,
        focusedNode: null,
        forceFocus: false,
      };
      break;
    }
    case 'outer-focus-previous': {
      if (!state.outerFocusedNode) {
        console.warn("No outer focused node, can't focus previous");
        return state;
      }
      const previousNode = getPreviousNode(state, state.outerFocusedNode);
      if (!previousNode) return state;
      newState = {
        ...state,
        outerFocusedNode: previousNode,
        focusedNode: null,
        forceFocus: false,
      };
    }
  }

  // If there are no children add a ControlPanel to the root
  if (newState.children?.length === 0) {
    newState.children = [ControlPanel.empty()];
  }
  return newState;
};

export const getPreviousNode = (root: RootPanelProps, path: number[]): number[] | null => {
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNode(root, parentPath);

  if (!parent || !parent.children) {
    console.warn('No node found for path', path);
    return null;
  }
  const index = path.at(-1)!;
  if (index > 0) {
    return [...parentPath, index - 1];
  } else {
    if (parentPath.length === 0) {
      return null;
    }
    return parentPath;
  }
};

const getNode = (root: RootPanelProps, path: number[]): PanelProps | null => {
  let stateIterator: PanelProps = root;
  for (const key of path) {
    if (!stateIterator.children) {
      console.warn('No children found for path', path);
      return null;
    }
    stateIterator = stateIterator.children[key];
  }
  return stateIterator;
};

export const getNextNode = (root: RootPanelProps, path: number[]): number[] | null => {
  const parentPath = path.slice(0, path.length - 1);
  const parent = getNode(root, parentPath);

  if (!parent || !parent.children) {
    console.warn('No node found for path', path);
    return null;
  }

  const index = path.at(-1)!;
  if (index < parent.children.length - 1) {
    return [...parentPath, index + 1];
  } else {
    if (parentPath.length === 0) {
      return null;
    }
    // We are in the last node of this parent, so we need to go to the next node in the parent
    return getNextNode(root, parentPath);
  }
};

export const updateChildren = (
  editorState: RootPanelProps,
  path: number[],
  action: (children: PanelProps[]) => void
): RootPanelProps => {
  const newState = { ...editorState };
  let stateIterator: PanelProps | RootPanelProps = newState;

  if (path.length === 0) {
    if (!stateIterator.children) stateIterator.children = [];
    else stateIterator.children = [...stateIterator.children];
    action(stateIterator.children);
    return newState;
  }

  for (let [index, key] of path.entries()) {
    // Create children if they do not already exist
    if (!stateIterator.children) {
      stateIterator.children = [];
    }

    // If the key is larger than the children array, we set it to the last index
    if (key > stateIterator.children.length) {
      console.warn('Index is larger than the children array. This is probably a bug.', path, stateIterator);
      key = stateIterator.children.length;
    }

    // We are at the end of the chain, therefore we can set the new data
    const isLast = index === path.length - 1;
    stateIterator.children = [...stateIterator.children];
    if (isLast) {
      action(stateIterator.children);
    } else {
      // We are not at the end of the chain, therefore we need to go deeper
      stateIterator = { ...stateIterator.children[key] };
    }
  }
  return newState;
};

export const getPanelAt = (state: PanelProps, indexes: number[]): PanelProps => {
  if (indexes.length === 0) {
    return state;
  }
  if (!state.children) {
    throw new Error('Cannot get panel from a panel that does not have children');
  }
  const [index, ...rest] = indexes;
  return getPanelAt(state.children[index], rest);
};
