import c from './control-panel.module.scss';
import { FC, KeyboardEvent, useRef, useState } from 'react';
import { useFocusTrap, useTabModifier } from '../../hooks/tap-focus';
import { EditorPanel } from '../state/editor-panel';
import { PanelProps, useUpdateEditor } from '../state/editor-state';
import { usePanels } from '../state/panels';

export type ControlPanelProps = PanelProps;

export const ControlPanel: EditorPanel<ControlPanelProps> = {
  name: 'Control Panel',
  capabilities: {
    canBeDeleted: true,
    canHaveChildren: false,
    canBeInnerFocused: true,
    canBeDragged: true,
  },
  Icon: () => null,
  Edit: () => {
    const controlInput = useRef<HTMLInputElement>(null);
    const outerDiv = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState<string>();
    const [isClosed, setIsClosed] = useState(true);
    const dispatch = useUpdateEditor();

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
            controlInput.current?.focus();
          } else {
            setIsClosed(false);
          }
        }}
      >
        <input
          ref={controlInput}
          placeholder={'Search for blocks'}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !search) dispatch('delete', null);
          }}
          contentEditable={true}
          data-empty-text="Search for blocks"
          onInput={(e) => setSearch(e.currentTarget.value)}
          className="w-full p-1"
        ></input>
        {shouldShow() && <PanelOutlet search={search ?? ''} />}
      </div>
    );
  },
  View: () => null,
  canHandle(type: PanelProps) {
    return type.name === this.name;
  },
  empty(): ControlPanelProps {
    return {
      name: this.name,
      ethereal: {
        focused: false,
        outerFocused: false,
      },
      data: undefined,
    };
  },
};

const PanelOutlet: FC<{ search: string }> = ({ search }) => {
  const dispatch = useUpdateEditor();
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
            onClick={() => dispatch('replace', p.empty())}
          >
            {<p.Icon size={'var(--icon-m)'} />} <span className="p-s">{p.name}</span>
          </button>
        );
      })}

      {panels.length === 0 && <div className="p-s">No blocks found</div>}
    </div>
  );
};
