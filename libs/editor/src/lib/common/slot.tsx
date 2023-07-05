import { AddIcon } from '@image-blog/shared-ui';
import { FC, ReactNode, useEffect, useRef } from 'react';
import { useIsNodeInnerFocused, useIsNodeOuterFocused, useNode, useNodeIndex, useUpdateEditor } from '../state-holder';
import c from './slot.module.scss';
import { usePageFocus } from '../hooks/page-focus';
import { ControlNode } from '../nodes/control-node';
import { isShortcut } from '../keyboard-event';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const slotRef = useRef<HTMLDivElement>(null);

  const dispatch = useUpdateEditor();
  const { id: nodeId, capabilities } = useNode();
  const isOuterFocused = useIsNodeOuterFocused();
  const nodeFocus = useIsNodeInnerFocused();
  const path = useNodeIndex();
  const currentFocus = usePageFocus();

  useEffect(() => {
    if (!isOuterFocused || !slotRef.current) return;
    slotRef.current.focus();
  }, [isOuterFocused]);

  useEffect(() => {
    if (capabilities.canBeInnerFocused || !nodeFocus.isFocused) return;
    dispatch('outer-focus', { at: path });
  }, [nodeFocus.isFocused, nodeFocus.force, capabilities.canBeInnerFocused, dispatch, path]);

  useEffect(() => {
    const isFocusInside = !!slotRef.current?.contains(document.activeElement!) && slotRef.current !== currentFocus;

    // ONLY if the focus is inside the slot and the node is not focused, focus the node.
    // ONLY focus if the closest node to the focus is the current node
    const isClosestNode = currentFocus?.closest(`[data-is-slot="true"]`) === slotRef.current;
    if (isFocusInside && !nodeFocus.isFocused && isClosestNode) {
      dispatch('focus', { force: false, at: path });
    }
    // DO NOT ADD ANYTHING ELSE, AS THIS WILL OTHERWISE CAUSE AN INFINITE LOOP
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFocus]);

  return (
    <div
      ref={slotRef}
      data-is-slot={true}
      data-slot-name={nodeId}
      data-path={path.join('.')}
      tabIndex={0}
      className={`${c.slot} ${isOuterFocused ? 'bg-secondary' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          dispatch('outer-focus', { at: path });
          e.stopPropagation();
        }

        // Check if the origin of the evnet is the slot, otherwise discard because another slot will handle it
        if (e.target !== slotRef.current) return;

        if (e.key === 'Enter') {
          dispatch('focus', { force: true, at: path });
        } else if (isShortcut(e.nativeEvent, 'Shift+Alt+ArrowUp')) {
          dispatch('move-outer-focused-up', null);
        } else if (isShortcut(e.nativeEvent, 'Shift+ArrowUp')) {
          dispatch('outer-focus-previous', { mode: 'add' });
        } else if (isShortcut(e.nativeEvent, 'ArrowUp')) {
          dispatch('outer-focus-previous', { mode: 'replace' });
        } else if (isShortcut(e.nativeEvent, 'Shift+Alt+ArrowDown')) {
          dispatch('move-outer-focused-down', null);
        } else if (isShortcut(e.nativeEvent, 'Shift+ArrowDown')) {
          dispatch('outer-focus-next', { mode: 'add' });
        } else if (isShortcut(e.nativeEvent, 'ArrowDown')) {
          dispatch('outer-focus-next', { mode: 'replace' });
        } else if ((e.key === 'Delete' || e.key === 'Backspace') && isOuterFocused) {
          dispatch('delete', { selection: true });
        }
      }}
    >
      {capabilities.structural ? null : (
        <button
          onClick={() => {
            dispatch('add', {
              at: path,
              node: ControlNode.empty(),
            });
            dispatch('focus-next', { force: true });
          }}
        >
          <AddIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
        </button>
      )}
      <div className="flex-grow">{children}</div>
    </div>
  );
};
