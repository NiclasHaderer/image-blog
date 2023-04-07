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

export type EditorAction<T> = { type: string; path: number[]; payload: T };
export type EditorActions = ReplaceAction | CreateAction | DeleteAction;

export const editorReducer = ({ ...state }: RootPanelProps, action: EditorActions) => {
  let newState;
  switch (action.type) {
    case 'replace': {
      const parentPath = action.path.slice(0, action.path.length - 1);
      newState = updateChildren(state, parentPath, (children) => {
        children[action.path[action.path.length - 1]] = action.payload;
      });
      break;
    }
    case 'add': {
      const parentPath = action.path.slice(0, action.path.length - 1);
      newState = updateChildren(state, parentPath, (children) => {
        children.splice(action.path[action.path.length - 1], 0, action.payload);
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
  }

  // If there are no children add a ControlPanel to the root
  if (newState.children?.length === 0) {
    newState.children = [ControlPanel.empty()];
  }
  return newState;
};
export const updateChildren = (
  editorState: RootPanelProps,
  path: number[],
  action: (children: PanelProps[]) => void
) => {
  const newState = { ...editorState };
  let stateIterator = newState;

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
