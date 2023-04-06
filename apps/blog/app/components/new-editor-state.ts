 import {createContext} from "react";

export interface PanelInteractions {
  onUpdate?: <V extends PanelData>(newState: V) => void;
  onCreate?: <V extends PanelData>(newState: V) => void;
  onDelete?: () => void;
}

export interface PanelEthereal {
  focused: boolean;
  outerFocused: boolean;
}

export interface PanelData {
  type: string;
}

export interface PanelProps {
  interaction: PanelInteractions;
  ethereal: PanelEthereal;
  data: PanelData;
  children?: PanelProps[];
}

export type EditorState = PanelProps[];

const usePanelState = (): PanelProps => {
  // TODO
}

const EditorContext = createContext([] as EditorState)
// Now every slot has a index property and using that it can access the panel state, and provide a value for the usePanelState hook
// It then creates a new context using the own panel state as the root state, thereby allowing the children to access the state
// It is important that the update function will also update the parent state, so that the parent can rerender the children
