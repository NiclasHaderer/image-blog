import { AddIcon, DragIcon } from './icons';
import { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react';
import { useIsFocused, useIsOuterFocused, usePanelCapabilities, useUpdateEditor } from '../state/editor-state';
import { ControlPanel } from '../panels/control-panel';
import c from './slot.module.scss';
import { useCurrentFocus } from '../../hooks/current-focus';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useUpdateEditor();
  const slotRef = useRef<HTMLDivElement>(null);
  const panel = usePanelCapabilities();
  const isOuterFocused = useIsOuterFocused();
  const { isFocused: isInnerFocused } = useIsFocused();
  const currentFocus = useCurrentFocus();

  useEffect(() => {
    if (!isOuterFocused || !slotRef.current) return;
    slotRef.current.focus();
  }, [isOuterFocused]);

  useEffect(() => {
    const isFocusInside = !!slotRef.current?.contains(document.activeElement!) && slotRef.current !== currentFocus;
    if (isFocusInside && !isInnerFocused) dispatch('focus', { force: false });
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
      tabIndex={0}
      className={`${c.slot} ${isOuterFocused ? 'bg-secondary' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          dispatch('focus', { force: true });
        } else if (e.key === 'Escape') {
          dispatch('outer-focus', null);
        } else if (e.key === 'ArrowUp') {
          dispatch('outer-focus-previous', null);
        } else if (e.key === 'ArrowDown') {
          dispatch('outer-focus-next', null);
        } else if (e.key === 'Delete' && isOuterFocused) {
          dispatch('delete', null);
        } else if (e.key === 'Backspace' && isOuterFocused) {
          dispatch('delete', null);
        }
      }}
    >
      <button
        onClick={() => {
          dispatch('add', ControlPanel.empty());
          dispatch('focus-next', { force: true, reference: 'currentNode' });
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
