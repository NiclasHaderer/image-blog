import { PanelProps } from './new-editor-state';
import console from 'console';

type ReplaceAction = {
  type: 'replace';
  path: number[];
  payload: PanelProps;
};

type CreateAction = {
  type: 'create';
  path: number[];
  payload: PanelProps;
};

export type EditorActions = ReplaceAction | CreateAction;

export const replaceAndCreate = (editorState: PanelProps, { payload, path }: ReplaceAction | CreateAction) => {
  const newState = { ...editorState };
  let stateCopy = newState;
  for (let [index, key] of path.entries()) {
    // Create children if they do not already exist
    if (!stateCopy.children) {
      if (!stateCopy.data.canHaveChildren) {
        console.warn('Cannot add children to a panel that cannot have children', path, newState);
        return;
      }
      stateCopy.children = [];
    }

    // If the key is larger than the children array, we set it to the last index
    if (key > stateCopy.children.length) {
      console.warn('Index is larger than the children array. This is probably a bug.', path, newState);
      key = stateCopy.children.length;
    }

    // We are at the end of the chain, therefore we can set the new data
    if (index === path.length - 1) {
      stateCopy.children[key] = payload;
    } else {
      // We are not at the end of the chain, therefore we need to go deeper
      stateCopy = { ...stateCopy.children[key] };
    }
  }
  return newState;
};

export const editorReducer = (state: PanelProps, action: EditorActions) => {
  switch (action.type) {
    case 'replace':
    case 'create':
      replaceAndCreate(state, action);
      return state;
  }
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
