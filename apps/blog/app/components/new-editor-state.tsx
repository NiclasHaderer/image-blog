import { createContext, FC, useContext, useReducer } from 'react';
import { EditorActions, editorReducer } from './new-editor-update';

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
  canHaveChildren: boolean;
  canBeDragged: boolean;
  canBeDeleted: boolean;
  canBeOuterFocused: boolean;
}

export interface PanelProps {
  interaction: PanelInteractions;
  ethereal: PanelEthereal;
  data: PanelData;
  children?: PanelProps[];
}

export type EditorState = PanelProps[];

const _RootEditorContext = createContext({
  update: (newData: EditorActions): void => {
    throw new Error('Do not use the update function of the RootEditorContext outside of the RootEditorContextProvider');
  },
  data: {} as PanelProps,
});

export const RootEditorContextProvider = () => {
  const [editorState, setEditorState] = useReducer(editorReducer, {
    children: [],
    data: {
      type: 'root',
      canBeDeleted: false,
      canBeDragged: false,
      canHaveChildren: true,
      canBeOuterFocused: false,
    },
    ethereal: {
      focused: true,
      outerFocused: false,
    },
    interaction: {},
  });

  return (
    <_RootEditorContext.Provider
      value={{
        data: editorState,
        update: setEditorState,
      }}
    />
  );
};

const _ChildContext = createContext({
  index: [] as number[],
});

const PanelRenderer: FC<{ panel: PanelProps }> = ({ panel }) => {
  // TODO: Implement rendering
  return <>panel</>;
};

export const EditorChildren: FC<{ children: PanelProps }> = ({ children }) => {
  const childContext = useContext(_ChildContext);
  return (
    <>
      {children.children?.map((child, index) => {
        return (
          <_ChildContext.Provider
            key={index}
            value={{
              index: [...childContext.index, index],
            }}
          >
            <PanelRenderer panel={child} />
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
    payload: Omit<V, 'type' | 'path'>
  ) => {
    rootContext.update({
      type: action,
      path: index,
      payload: payload as any,
    });
  };
};
