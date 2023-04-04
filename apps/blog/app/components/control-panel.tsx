import c from './control-panel.module.scss';
import { FC, KeyboardEvent, useRef, useState } from 'react';
import { useFocusTrap, useTabModifier } from '../hooks/tap-focus';
import { useOnMount } from '../hooks/livecycle';

type Action = 'block' | 'divider' | 'column' | 'image';

export type ControlPanelData = {
  type: 'control-panel';
  focus: boolean;
  text?: string;
};

export const ControlPanel: FC<
  {
    onInput?: (input: string | null) => void;
    onAction?: (action: Action) => void;
  } & ControlPanelData
> = ({ onInput, onAction, focus }) => {
  const editableDiv = useRef<HTMLDivElement>(null);
  const outerDiv = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>();
  const [isClosed, setIsClosed] = useState(true);

  useOnMount(() => {
    if (!focus) return;
    editableDiv.current?.focus();
  });

  const shouldShow = (): boolean => {
    return !isClosed && search !== undefined && search.length > 0;
  };

  useFocusTrap(outerDiv.current);
  const { focusPrevious, focusNext } = useTabModifier();
  return (
    <div
      className={c.controlPanelWrapper}
      ref={outerDiv}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          focusPrevious();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          focusNext();
        } else if (event.key === 'Escape') {
          setIsClosed(true);
          editableDiv.current?.focus();
        } else {
          setIsClosed(false);
        }
      }}
    >
      <div
        tabIndex={1}
        ref={editableDiv}
        contentEditable={true}
        data-empty-text="Search for blocks"
        onInput={(e) => {
          // Remove <br> when empty
          if (editableDiv.current) {
            if (editableDiv.current.innerHTML === '<br>') {
              editableDiv.current.innerText = '';
            }
          }

          onInput?.(e.currentTarget.innerText || null);
          setSearch(e.currentTarget.innerText);
        }}
        className={c.controlPanel}
      ></div>
      {shouldShow() && (
        <div className={c.controlPanelOutlet}>
          <div
            className={c.action}
            tabIndex={1}
            onClick={() => onAction?.('divider')}
            onKeyDown={(e) => e.key === 'Enter' && onAction?.('divider')}
          >
            Divider
          </div>
          <div
            className={c.action}
            tabIndex={1}
            onClick={() => onAction?.('image')}
            onKeyDown={(e) => e.key === 'Enter' && onAction?.('divider')}
          >
            Image
          </div>
        </div>
      )}
    </div>
  );
};
