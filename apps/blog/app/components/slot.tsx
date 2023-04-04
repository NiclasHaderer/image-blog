import React, { FC, ReactNode, useRef } from 'react';
import c from './slot.module.scss';
import { AddIcon, DragIcon } from './icons';

export const Slot: FC<{
  children: ReactNode;
  onNew?: () => void;
  focused: boolean;
  onEscape: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onEnter: () => void;
  onDelete: () => void;
  onInnerFocus: () => void;
  onFocusLoss: () => void;
}> = ({ children, onDelete, focused, onInnerFocus, onFocusLoss, onNext, onPrevious, onEnter, onEscape, onNew }) => {
  const slotRef = useRef<HTMLDivElement>(null);
  if (focused && slotRef.current) slotRef.current.focus();
  // TODO enter always causes inner focus
  return (
    <div
      ref={slotRef}
      tabIndex={1}
      data-is-slot={true}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onEscape();
        else if (e.key === 'Enter') onEnter();
        else if (e.key === 'ArrowDown') onPrevious();
        else if (e.key === 'ArrowUp') onNext();
        else if (e.key === 'Delete' || e.key === 'Backspace') onDelete();
      }}
      onFocus={(e) => {
        if (e.target !== e.currentTarget && e.currentTarget.contains(e.target)) {
          onInnerFocus();
        }
      }}
      className={`flex items-center p-s ${c.slot} ${focused ? 'bg-secondary' : ''}`}
    >
      {focused.toString()}
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
