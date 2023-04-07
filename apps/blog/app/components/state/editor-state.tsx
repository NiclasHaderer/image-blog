import { createContext, FC, ReactNode, useContext, useReducer } from 'react';
import { EditorAction, EditorActions, editorReducer } from './update/reducer';
import { usePanels } from './panels';
import { ControlPanel } from '../panels/control-panel';
import { Slot } from '../common/slot';

export interface PanelEthereal {
  focused: boolean;
  outerFocused: boolean;
}

export interface PanelProps<T = unknown> {
  name: string;
  ethereal: PanelEthereal;
  children?: PanelProps[];
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootPanelProps extends PanelProps {}

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
    ethereal: {
      focused: true,
      outerFocused: false,
    },
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
      path: index,
      payload: payload as any,
    });
  };
};
