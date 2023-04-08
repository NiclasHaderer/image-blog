import { PanelProps, RootPanelProps } from '../editor-state';
import { updateChildren } from './utils';

export const replacePanel = (state: RootPanelProps, path: number[], payload: PanelProps): RootPanelProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children) => {
    children[path.at(-1)!] = payload;
  });
};

export const addPanel = (state: RootPanelProps, path: number[], payload: PanelProps): RootPanelProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children) => {
    children.splice(path.at(-1)! + 1, 0, payload);
  });
};

export const deletePanel = (state: RootPanelProps, path: number[]): RootPanelProps => {
  const parentPath = path.slice(0, path.length - 1);
  return updateChildren(state, parentPath, (children) => {
    children.splice(path.at(-1)!, 1);
  });
};
