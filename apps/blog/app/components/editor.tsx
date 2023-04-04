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
          <Slot
            key={index}
            focused={editorState.isOuterFocused(index)}
            onEscape={() => editorState.outerFocus(index)}
            onEnter={() => editorState.focusPanel(index)}
            onPrevious={() => editorState.outerFocusNext()}
            onNext={() => editorState.outerFocusPrevious()}
            onDelete={() => editorState.removeNodeAt(index)}
            onNew={() => editorState.addControlAt(index + 1)}
            onFocusLoss={() => editorState.resetOuterFocus()}
            onInnerFocus={() => editorState.focusPanel(index)}
          >
            <Panel.Edit
              {...item}
              onCreate={(node) => {
                editorState.replaceNodeAt(index, node);
                editorState.addControlAtEnd();
              }}
              onDelete={() => editorState.removeNodeAt(index)}
              onUpdate={(node) => editorState.replaceNodeAt(index, node)}
              focused={editorState.isFocused(index)}
              outerFocused={editorState.isOuterFocused(index)}
            />
          </Slot>
        );
      })}
    </>
  );
};
