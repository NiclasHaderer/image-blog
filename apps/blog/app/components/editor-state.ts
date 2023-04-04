import { ControlPanel } from './panels/control-panel';
import { DeepReadonly } from '../types';
import { TypedStructure } from './panels/editor-panel';
import { DividerPanel } from './panels/divider-panel';

export type RawEditorState = TypedStructure[];

class StateHolder {
  private timeout?: number;

  constructor(
    private _editorState: RawEditorState,
    private triggerUpdate: () => void
  ) {}

  public get state(): DeepReadonly<RawEditorState> {
    return this._editorState;
  }

  protected set state(editorState: DeepReadonly<RawEditorState>) {
    this._editorState = editorState as RawEditorState;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.triggerUpdate();
    }, 2) as unknown as number;
  }
}

export class EditorState extends StateHolder {
  constructor(triggerUpdate: () => void, editorState?: RawEditorState) {
    super(
      editorState ?? [DividerPanel.empty(), ControlPanel.empty()],
      triggerUpdate
    );
  }

  public addNodeAt(position: number, ...node: TypedStructure[]) {
    const clone = [...this.state];
    clone.splice(position, 0, ...node);
    this.state = clone;
  }

  addControlAt(position: number, focus = true) {
    this.addNodeAt(position, ControlPanel.empty());
  }

  addControlAtEnd(focus = true) {
    this.addNodeAt(this.state.length, ControlPanel.empty());
  }

  public replaceNodeAt(position: number, node: TypedStructure) {
    const clone = [...this.state];
    clone.splice(position, 1, node);
    this.state = clone;
  }

  public removeNodeAt(position: number) {
    const clone = [...this.state];
    clone.splice(position, 1);
    this.state = clone;
  }
}
