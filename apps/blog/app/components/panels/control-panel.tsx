import c from './control-panel.module.scss';
import { FC, KeyboardEvent, useRef, useState } from 'react';
import { useFocusTrap, useTabModifier } from '../../hooks/tap-focus';
import { useOnMount } from '../../hooks/livecycle';
import { EditorPanel, TypedStructure } from './editor-panel';
import { usePanels } from '../main-editor';

export interface ControlPanelData extends TypedStructure {
  type: 'control-panel';
  focus: boolean;
}

const PanelOutlet: FC<
  Pick<ControlPanelData, 'onCreate'> & { search: string }
> = ({ onCreate, search }) => {
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
            {<p.Icon size={'var(--icon-m)'} />}{' '}
            <span className="p-s">{p.name}</span>
          </button>
        );
      })}

      {panels.length === 0 && <div className="p-s">No blocks found</div>}
    </div>
  );
};

export const ControlPanel: EditorPanel<ControlPanelData> = {
  name: 'Control Panel',
  Icon: () => null,
  Edit: ({ onCreate, onUpdate, focus }) => {
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault();
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
        {shouldShow() && (
          <PanelOutlet onCreate={onCreate} search={search ?? ''} />
        )}
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
      focus: true,
    };
  },
};
