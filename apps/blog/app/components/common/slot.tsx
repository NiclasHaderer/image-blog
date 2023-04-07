import { AddIcon, DragIcon } from './icons';
import { FC, ReactNode } from 'react';
import c from './slot.module.scss';
import { useUpdateEditor } from '../state/editor-state';
import { ControlPanel } from '../panels/control-panel';

export const Slot: FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useUpdateEditor();
  return (
    <div className={`${c.slot}`}>
      <button onClick={() => dispatch('add', ControlPanel.empty())}>
        <AddIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <button onClick={() => dispatch('delete', null)}>
        <DragIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
