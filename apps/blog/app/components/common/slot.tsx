import { AddIcon, DragIcon } from './icons';
import { CSSProperties, FC, ReactNode } from 'react';
import { useIsOuterFocused, usePanelCapabilities, useUpdateEditor } from '../state/editor-state';
import { ControlPanel } from '../panels/control-panel';
import c from './slot.module.scss';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useUpdateEditor();
  const panel = usePanelCapabilities();
  const isOuterFocused = useIsOuterFocused();

  // If the panel cannot be dragged do not show the drag icon
  const moveStyles: CSSProperties = {};
  if (!panel.canBeDragged) {
    moveStyles.visibility = 'hidden';
    moveStyles.pointerEvents = 'none';
  }

  return (
    <div
      className={`${c.slot} ${isOuterFocused ? 'bg-secondary' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          dispatch('focus', null);
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
          dispatch('focus-next', null);
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
