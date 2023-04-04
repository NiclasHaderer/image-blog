import React, { FC, ReactNode } from 'react';
import c from './slot.module.scss';
import { AddIcon, DragIcon } from './icons';

export const Slot: FC<{
  children: ReactNode;
  onNew?: () => void;
}> = ({ children, onNew }) => {
  return (
    <div className={`flex items-center p-s ${c.slot}`}>
      <button onClick={onNew}>
        <AddIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <button>
        <DragIcon style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }} />
      </button>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
