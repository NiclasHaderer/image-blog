import React, { useRef } from 'react';
import { Slot } from './slot';
import { EditorState } from './editor-state';
import { useTriggerUpdate } from '../hooks/trigger-update';
import { usePanels } from './main-editor';

export const Editor = () => {
  const triggerUpdate = useTriggerUpdate();
  const { current: editorState } = useRef(new EditorState(triggerUpdate));
  const panels = usePanels();

  return (
    <>
      {editorState.state.map((item, index) => {
        const Panel = panels.find((p) => p.canHandle(item));
        if (!Panel) {
          return <div key={index}>Unknown component {item.type}</div>;
        }

        return (
          <Slot key={index} onNew={() => editorState.addControlAt(index + 1)}>
            <Panel.Edit
              {...item}
              onCreate={(node) => {
                editorState.replaceNodeAt(index, node);
                editorState.addControlAtEnd();
              }}
              onUpdate={(node) => editorState.replaceNodeAt(index, node)}
            />
          </Slot>
        );
      })}
    </>
  );
};
