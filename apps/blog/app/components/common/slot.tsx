import { AddIcon, DragIcon } from './icons';
import { CSSProperties, FC, ReactNode } from 'react';
import { usePanelCapabilities, useUpdateEditor } from '../state/editor-state';
import { ControlPanel } from '../panels/control-panel';
import c from './slot.module.scss';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useUpdateEditor();
  const panel = usePanelCapabilities();

  // If the panel cannot be dragged do not show the drag icon
  const moveStyles: CSSProperties = {};
  if (!panel.canBeDragged) {
    moveStyles.visibility = 'hidden';
    moveStyles.pointerEvents = 'none';
  }

  return (
    <div className={`${c.slot}`}>
      <button onClick={() => dispatch('add', ControlPanel.empty())}>
        <AddIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <button style={moveStyles}>
        <DragIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
