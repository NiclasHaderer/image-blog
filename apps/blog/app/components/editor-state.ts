import { ControlPanelData } from './control-panel';
import { ImagePanelData } from './image-panel';
import { DividerPanelData } from './divider-panel';
import { DeepReadonly } from '../types';

export type RawEditorNode =
  | ControlPanelData
  | ImagePanelData
  | DividerPanelData;

export type RawEditorState = (
  | ControlPanelData
  | ImagePanelData
  | DividerPanelData
)[];

class State {
  constructor(private _editorState: RawEditorState) {}
}

export class EditorState {
  private editorState: RawEditorState;

  constructor(private triggerUpdate: () => void, editorState?: RawEditorState) {
    this.editorState = editorState ?? [
      {
        type: 'control-panel',
        focus: true,
      },
    ];
  }

  public get state(): DeepReadonly<RawEditorState> {
    return this.editorState;
  }

  public addNodeAt(position: number, ...node: RawEditorNode[]) {
    const clone = [...this.editorState];
    clone.splice(position, 0, ...node);
    this.editorState = clone;
    this.triggerUpdate();
  }

  addControlAt(position: number, focus = true) {
    this.addNodeAt(position, {
      type: 'control-panel',
      focus,
    });
  }

  public replaceNodeAt(position: number, node: RawEditorNode) {
    const clone = [...this.editorState];
    clone.splice(position, 0, node);
    this.editorState = clone;
    this.triggerUpdate();
  }
}
