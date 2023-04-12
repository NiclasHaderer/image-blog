import { AddIcon } from './icons';
import { FC, ReactNode, useEffect, useRef } from 'react';
import {
  useIsNodeInnerFocused,
  useIsNodeOuterFocused,
  useNodeCapabilities,
  useNodeIndex,
  useUpdateEditor,
} from '../state/editor-state';
import c from './slot.module.scss';
import { usePageFocus } from '../hooks/page-focus';
import { ControlNode } from '../nodes/control-node';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const slotRef = useRef<HTMLDivElement>(null);

  const dispatch = useUpdateEditor();
  const capabilities = useNodeCapabilities();
  const isOuterFocused = useIsNodeOuterFocused();
  const nodeFocus = useIsNodeInnerFocused();
  const path = useNodeIndex();
  const currentFocus = usePageFocus();

  useEffect(() => {
    if (!isOuterFocused || !slotRef.current) return;
    slotRef.current.focus();
  }, [isOuterFocused]);

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
        } else if (e.key === 'ArrowUp') {
          if (e.shiftKey && e.altKey) {
            dispatch('move-outer-focused-up', null);
          } else if (e.shiftKey) {
            dispatch('outer-focus-previous', { mode: 'add' });
          } else {
            dispatch('outer-focus-previous', { mode: 'replace' });
          }
        } else if (e.key === 'ArrowDown') {
          if (e.shiftKey && e.altKey) {
            dispatch('move-outer-focused-down', null);
          } else if (e.shiftKey) {
            dispatch('outer-focus-next', { mode: 'add' });
          } else {
            dispatch('outer-focus-next', { mode: 'replace' });
          }
        } else if ((e.key === 'Delete' && isOuterFocused) || (e.key === 'Backspace' && isOuterFocused)) {
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