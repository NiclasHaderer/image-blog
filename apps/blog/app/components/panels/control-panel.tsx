import c from './control-panel.module.scss';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useFocusTrap, useTabModifier } from '../../hooks/tap-focus';
import { EditorPanel, PanelState, TypedStructure } from './editor-panel';
import { usePanels } from '../main-editor';

export interface ControlPanelData extends TypedStructure {
  type: 'control-panel';
}

export type ControlPanelState = PanelState;

export const ControlPanel: EditorPanel<ControlPanelData, ControlPanelState> = {
  name: 'Control Panel',
  Icon: () => null,
  Edit: ({ onCreate, onUpdate, onDelete, focused }) => {
    const editableDiv = useRef<HTMLDivElement>(null);
    const outerDiv = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState<string>();
    const [isClosed, setIsClosed] = useState(true);
    if (focused) editableDiv.current?.focus();

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
          if (shouldShow()) {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              focusPrevious();
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              focusNext();
            }
          }
          if (event.key === 'Escape') {
            // Do not propagate if the PanelOutlet is not closed, as then the event will trigger the close of the PanelOutlet
            if (shouldShow()) {
              event.stopPropagation();
            }
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
            if (e.key === 'Backspace' && !search) onDelete?.();
          }}
          contentEditable={true}
          data-empty-text="Search for blocks"
          onInput={(e) => {
            // Remove <br> when empty
            if (editableDiv.current) {
              if (editableDiv.current.innerHTML === '<br>') {
                editableDiv.current.innerText = '';
              }
            }

            onUpdate?.({
              type: 'control-panel',
              focus: true,
            });
            setSearch(e.currentTarget.innerText);
          }}
          className={c.controlPanel}
        ></div>
        {shouldShow() && <PanelOutlet onCreate={onCreate} search={search ?? ''} />}
      </div>
    );
  },
  Render: () => {
    return null;
  },
  canHandle(type: TypedStructure): type is ControlPanelData {
    return type.type === 'control-panel';
  },
  empty(): ControlPanelData {
    return {
      type: 'control-panel',
    };
  },
};

const PanelOutlet: FC<Pick<ControlPanelState, 'onCreate'> & { search: string }> = ({ onCreate, search }) => {
  const panels = usePanels()
    .filter((p) => p.name !== 'Control Panel')
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className={c.controlPanelOutlet}>
      {panels.map((p) => {
        return (
          <button
            key={p.name}
            className={`${c.action} cursor-pointer w-full flex items-center`}
            onClick={() => onCreate?.(p.empty())}
          >
            {<p.Icon size={'var(--icon-m)'} />} <span className="p-s">{p.name}</span>
          </button>
        );
      })}

      {panels.length === 0 && <div className="p-s">No blocks found</div>}
    </div>
  );
};
