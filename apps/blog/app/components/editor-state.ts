import { ControlPanel } from './panels/control-panel';
import { DeepReadonly } from '../types';
import { TypedStructure } from './panels/editor-panel';
import { DividerPanel } from './panels/divider-panel';

export type RawEditorState = TypedStructure[];

export type UserState = { outerFocus?: number; focusedPanel?: number };

class StateHolder {
  private stateTimeout?: number;

  constructor(private _editorState: RawEditorState, private _userState: UserState, private triggerUpdate: () => void) {}

  public get state(): DeepReadonly<RawEditorState> {
    return this._editorState;
  }

  protected set state(state: DeepReadonly<RawEditorState>) {
    this._editorState = state as RawEditorState;
    this.scheduleRepaint();
  }

  public get userState(): DeepReadonly<UserState> {
    return this._userState;
  }

  protected set userState(state: DeepReadonly<UserState>) {
    console.log(state);
    this._userState = state;
    this.scheduleRepaint();
  }

  private scheduleRepaint() {
    clearTimeout(this.stateTimeout);
    this.stateTimeout = setTimeout(() => {
      this.triggerUpdate();
    }, 2) as unknown as number;
  }
}

export class EditorState extends StateHolder {
  constructor(triggerUpdate: () => void, editorState?: RawEditorState) {
    super(editorState ?? [DividerPanel.empty(), ControlPanel.empty()], {}, triggerUpdate);
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

  public focusPanel(index: number) {
    this.userState = { focusedPanel: index };
  }

  public resetOuterFocus() {
    this.userState = {
      ...this.userState,
      outerFocus: undefined,
    };
  }

  public isOuterFocused(index: number): boolean {
    return this.userState.outerFocus === index;
  }

  public isFocused(index: number): boolean {
    return this.userState.focusedPanel === index;
  }

  public outerFocus(index: number) {
    this.userState = { outerFocus: index };
  }

  public outerFocusNext() {
    const currentIndex = this.userState.outerFocus;
    if (currentIndex === undefined) return;
    const nextIndex = currentIndex + 1 > this.state.length ? this.state.length : currentIndex + 1;

    this.userState = { outerFocus: nextIndex };
  }

  public outerFocusPrevious() {
    const currentIndex = this.userState.outerFocus;
    if (currentIndex === undefined) return;
    const nextIndex = currentIndex + -1 < 0 ? 0 : currentIndex - 1;

    this.userState = { outerFocus: nextIndex };
  }
}
