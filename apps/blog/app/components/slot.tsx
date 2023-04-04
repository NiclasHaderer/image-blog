import React, { FC, ReactNode } from 'react';
import { IoAddSharp } from 'react-icons/io5';
import { RxDragHandleDots2 } from 'react-icons/rx';
import c from './slot.module.scss';

export const Slot: FC<{
  children: ReactNode;
  onNew?: () => void;
}> = ({ children, onNew }) => {
  return (
    <div className={`flex items-center p-s ${c.slot}`}>
      <button onClick={onNew}>
        <IoAddSharp
          style={{ width: 'var(--icon-m)', height: 'var(--icon-m)' }}
        />
      </button>
      <button>
        <RxDragHandleDots2 />
      </button>
      <div className="flex-grow">{children}</div>
    </div>
  );
};
