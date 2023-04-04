import { ControlPanel } from './control-panel';
import React, { useRef } from 'react';
import { ImagePanel } from './image-panel';
import { Slot } from './slot';
import { DividerPanel } from './divider-panel';
import { EditorState } from './editor-state';
import { useTriggerUpdate } from '../hooks/trigger-update';

export const Editor = () => {
  const triggerUpdate = useTriggerUpdate();
  const { current: editorState } = useRef(new EditorState(triggerUpdate));

  return (
    <>
      {editorState.state.map((item, index) => {
        if (item.type === 'control-panel') {
          return (
            <Slot key={index} onNew={() => editorState.addControlAt(index + 1)}>
              <ControlPanel
                {...item}
                onAction={(action) => {
                  if (action === 'divider') {
                    editorState.addNodeAt(index + 1, { type: 'divider' });
                  } else if (action === 'image') {
                    editorState.addNodeAt(index + 1, {
                      type: 'image',
                      src: 'https://source.unsplash.com/random',
                      caption: 'Something',
                      width: '50%',
                    });
                  }
                }}
              />
            </Slot>
          );
        } else if (item.type === 'image') {
          return (
            <Slot key={index} onNew={() => editorState.addControlAt(index + 1)}>
              <ImagePanel {...item} />
            </Slot>
          );
        } else if (item.type === 'divider') {
          return (
            <Slot key={index} onNew={() => editorState.addControlAt(index + 1)}>
              <DividerPanel {...item} />
            </Slot>
          );
        }
      })}
    </>
  );
};
