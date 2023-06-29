import { useContext, useState } from 'react';
import { useGlobalEvent } from './global-events';
import { RootEditorContext, RootNodeProps, useOnEditorUpdate } from '../state/editor-state';

export const useEditorHistory = (maxHistory: number) => {
  const rootContext = useContext(RootEditorContext);
  const editorState = rootContext.data;

  const [history, setHistory] = useState<{
    past: RootNodeProps[];
    future: RootNodeProps[];
  }>({
    past: [],
    future: [],
  });

  useOnEditorUpdate((oldState, newState, action) => {
    // We do not want to skip history when we replace the root node
    if (action.type === 'replace-root' && action.payload.skipHistory) return;

    const newPast = [...history.past, editorState];
    if (newPast.length > maxHistory) {
      newPast.shift();
    }

    setHistory({
      past: newPast,
      future: [],
    });
  });

  useGlobalEvent('keydown', (e) => {
    if (e.key === 'z' && e.ctrlKey) {
      if (history.past.length > 0) {
        const newPast = [...history.past];
        const newFuture = [editorState, ...history.future];
        const newState = newPast.pop();
        if (newState) {
          setHistory({
            past: newPast,
            future: newFuture,
          });
          rootContext.update({
            type: 'replace-root',
            origin: [],
            payload: {
              with: newState,
              skipHistory: true,
            },
          });
        }
      }
    }

    if (e.key === 'Z' && e.ctrlKey) {
      if (history.future.length > 0) {
        const newPast = [...history.past, editorState];
        const newFuture = [...history.future];
        const newState = newFuture.shift();
        if (newState) {
          setHistory({
            past: newPast,
            future: newFuture,
          });
          rootContext.update({
            type: 'replace-root',
            origin: [],
            payload: {
              with: newState,
              skipHistory: true,
            },
          });
        }
      }
    }
  });
};
