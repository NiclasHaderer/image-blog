import { AddIcon, DragIcon } from './icons';
import { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react';
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

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const slotRef = useRef<HTMLDivElement>(null);

  const dispatch = useUpdateEditor();
  const panel = usePanelCapabilities();
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
    if (isFocusInside && !panelFocus.isFocused) dispatch('focus', { force: false, at: path });
    // DO NOT ADD ANYTHING ELSE, AS THIS WILL OTHERWISE CAUSE AN INFINITE LOOP
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFocus]);

  // If the panel cannot be dragged do not show the drag icon
  const moveStyles: CSSProperties = {};
  if (!panel.canBeDragged) {
    moveStyles.visibility = 'hidden';
    moveStyles.pointerEvents = 'none';
  }

  return (
    <div
      ref={slotRef}
      data-path={path.join('.')}
      tabIndex={0}
      className={`${c.slot} ${isOuterFocused ? 'bg-secondary' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          dispatch('focus', { force: true, at: path });
        } else if (e.key === 'Escape') {
          dispatch('outer-focus', { at: path });
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
          // TODO delete all selected panels (including the range)
          dispatch('delete', { at: path });
        }
      }}
    >
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
      <button style={moveStyles}>
        <DragIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
