import { createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { EditorAction, EditorActions, editorReducer } from './update/reducer';
import { usePanels } from './panels';
import { ControlPanel } from '../panels/control-panel';
import { Slot } from '../common/slot';
import { getNode, getNodesInRange } from './update/utils';

export interface PanelProps<T = unknown> {
  name: string;
  children?: PanelProps[];
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootPanelProps extends PanelProps {
  focusedNode: number[] | null;
  forceFocus: boolean;
  outerFocusedNode: number[] | null;
  outerFocusedRange: number | null;
}

const _RootEditorContext = createContext({
  update: (newData: EditorActions): void => {
    throw new Error('Do not use the update function of the RootEditorContext outside of the RootEditorContextProvider');
  },
  data: {} as RootPanelProps,
});

export const RootEditorContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [editorState, setEditorState] = useReducer(editorReducer, {
    children: [ControlPanel.empty()],
    name: 'root',
    data: {},
    focusedNode: [0],
    outerFocusedNode: null,
    outerFocusedRange: null,
    forceFocus: false,
  } satisfies RootPanelProps);

  return (
    <_RootEditorContext.Provider
      value={{
        data: editorState as RootPanelProps,
        update: (newData) => setEditorState(newData),
      }}
    >
      {children}
    </_RootEditorContext.Provider>
  );
};

export const RootEditorOutlet: FC<{ mode: 'view' | 'edit' }> = ({ mode }) => {
  const rootContext = useContext(_RootEditorContext);
  return <EditorChildren mode={mode}>{rootContext.data}</EditorChildren>;
};

const UnsetChildContext = Symbol('unset-child-context');
const _ChildContext = createContext({
  index: UnsetChildContext as unknown as number[],
});

const PanelRenderer: FC<{ panel: PanelProps; mode: 'view' | 'edit' }> = ({ panel, mode }) => {
  const panels = usePanels();
  const Panel = panels.find((p) => p.canHandle(panel));
  if (!Panel) {
    return <>Unknown component {panel.name}</>;
  }

  if (mode === 'view') {
    return <Panel.View {...panel} />;
  } else {
    return <Panel.Edit {...panel} />;
  }
};

export const EditorChildren: FC<{ children: PanelProps; mode: 'view' | 'edit' }> = ({ children, mode }) => {
  const childContext = useContext(_ChildContext);
  const contextToUse = (childContext.index as unknown) === UnsetChildContext ? { index: [] } : childContext;

  return (
    <>
      {children.children?.map((child, index) => {
        return (
          <_ChildContext.Provider
            key={index}
            value={{
              index: [...contextToUse.index, index],
            }}
          >
            <Slot>
              <PanelRenderer panel={child} mode={mode} />
            </Slot>
          </_ChildContext.Provider>
        );
      })}
    </>
  );
};

export const useUpdateEditor = () => {
  const rootContext = useContext(_RootEditorContext);
  const { index } = useContext(_ChildContext);

  return <T extends EditorActions['type'], V extends EditorActions & { type: T }>(
    action: T,
    payload: V extends EditorAction<infer S> ? S : never
  ) => {
    rootContext.update({
      type: action,
      origin: index,
      payload: payload as any,
    });
  };
};

export const usePanelProps = () => {
  const rootContext = useContext(_RootEditorContext).data;
  const { index } = useContext(_ChildContext);
  const node = getNode(rootContext, index);
  if (!node) throw new Error('No node found for index');

  return node;
};

export const usePanel = () => {
  const panelProps = usePanelProps();
  const panels = usePanels();
  const panel = panels.find((p) => p.canHandle(panelProps));
  if (!panel) {
    throw new Error('No panel found for panelProps');
  }
  return panel;
};

export const usePanelCapabilities = () => {
  const panel = usePanel();
  return panel.capabilities;
};

export const useIsFocused = () => {
  const rootContext = useContext(_RootEditorContext).data;
  const { index } = useContext(_ChildContext);
  const isFocused = rootContext.focusedNode?.join('.') === index.join('.');
  return {
    isFocused,
    force: rootContext.forceFocus,
  };
};

export const useIsOuterFocused = () => {
  const rootContext = useContext(_RootEditorContext).data;
  const { index } = useContext(_ChildContext);

  const outerFocusNode = rootContext.outerFocusedNode;
  const range = rootContext.outerFocusedRange ?? 0;
  if (!outerFocusNode) return false;
  const focusedNodes = getNodesInRange(rootContext, outerFocusNode, range);
  return focusedNodes.some((node) => node.join('.') === index.join('.'));
};

export const usePanelIndex = () => {
  const { index } = useContext(_ChildContext);
  return index;
};
