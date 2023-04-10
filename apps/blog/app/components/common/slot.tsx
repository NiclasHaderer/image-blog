import { AddIcon } from './icons';
import { FC, ReactNode, useEffect, useRef } from 'react';
import {
  useIsFocused,
  useIsOuterFocused,
  usePanelCapabilities,
  usePanelIndex,
  useUpdateEditor,
} from '../state/editor-state';
import { ControlPanel } from '../panels/control-panel';
import c from './slot.module.scss';
import { usePageFocus } from '../../hooks/page-focus';
import { useShortcut } from '../keyboard-event';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const slotRef = useRef<HTMLDivElement>(null);

  const dispatch = useUpdateEditor();
  const capabilities = usePanelCapabilities();
  const isOuterFocused = useIsOuterFocused();
  const panelFocus = useIsFocused();
  const currentFocus = usePageFocus();
  const path = usePanelIndex();

  useEffect(() => {
    if (!isOuterFocused || !slotRef.current) return;
    slotRef.current.focus();
  }, [isOuterFocused]);

  useEffect(() => {
    const isFocusInside = !!slotRef.current?.contains(document.activeElement!) && slotRef.current !== currentFocus;

    // ONLY if the focus is inside the slot and the panel is not focused, focus the panel.
    // ONLY focus if the closest panel to the focus is the current panel
    const isClosestPanel = currentFocus?.closest(`[data-is-slot="true"]`) === slotRef.current;
    if (isFocusInside && !panelFocus.isFocused && isClosestPanel) {
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
      {capabilities.noControls ? null : (
        <button
          onClick={() => {
            dispatch('add', {
              at: path,
              panel: ControlPanel.empty(),
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
