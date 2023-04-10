import c from './control-panel.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import { useFocusTrap, useTabModifier } from '../../hooks/tap-focus';
import { EditorPanel } from '../state/editor-panel';
import { PanelProps, useIsFocused, usePanelIndex, useUpdateEditor } from '../state/editor-state';
import { usePanelQuery } from '../state/panels';
import { useGlobalEvent } from '../../hooks/global-events';

export type ControlPanelProps = PanelProps;

export const ControlPanel: EditorPanel<ControlPanelProps> = {
  id: 'control-panel',
  capabilities: {
    canBeDeleted: true,
    canBeInnerFocused: true,
    canBeMoved: true,
    noControls: false,
    standalone: true,
  },
  Name: () => 'Control Panel',
  Icon: () => null,
  Render: () => {
    const controlInput = useRef<HTMLInputElement>(null);
    const outerDiv = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState<string>();
    const [isClosed, setIsClosed] = useState(true);
    const dispatch = useUpdateEditor();
    const path = usePanelIndex();
    const { isFocused, force } = useIsFocused();
    useEffect(() => {
      if (isFocused && force) {
        controlInput.current?.focus();
      }
    });
    useGlobalEvent(
      'keydown',
      () => {
        setIsClosed(true);
        controlInput.current?.focus();
      },
      (event) => event.key === 'Escape' && shouldShow()
    );

    useGlobalEvent('click', () => setIsClosed(true));

    const shouldShow = (): boolean => {
      return !isClosed && search !== undefined && search.length > 0;
    };

    useFocusTrap(outerDiv.current);
    const { focusPrevious, focusNext } = useTabModifier();
    return (
      <div
        className={c.controlPanelWrapper}
        ref={outerDiv}
        onKeyDown={(event) => {
          if (shouldShow()) {
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              focusPrevious();
            } else if (event.key === 'ArrowDown') {
              event.preventDefault();
              focusNext();
            } else if (event.key === 'Escape') {
              // Do not propagate, as we only want to close the panel
              if (shouldShow()) event.stopPropagation();
              setIsClosed(true);
            }
          }
          setIsClosed(false);
        }}
      >
        <input
          ref={controlInput}
          placeholder={'Search for blocks'}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !search) {
              dispatch('delete', { at: path });
            } else if (e.key === 'Enter') {
              dispatch('add', { at: path, panel: ControlPanel.empty() });
              dispatch('focus-next', { force: true });
            }
          }}
          contentEditable={true}
          data-empty-text="Search for blocks"
          onInput={(e) => setSearch(e.currentTarget.value)}
          className="w-full p-1 bg-transparent"
        ></input>
        {shouldShow() && <PanelOutlet search={search ?? ''} />}
      </div>
    );
  },
  distance: () => -Infinity,
  canHandle(type: PanelProps) {
    return type.id === this.id;
  },
  empty(): ControlPanelProps {
    return {
      id: this.id,
      data: undefined,
    };
  },
};

const PanelOutlet: FC<{ search: string }> = ({ search }) => {
  const dispatch = useUpdateEditor();
  const path = usePanelIndex();
  const panels = usePanelQuery(search);
  return (
    <div className={c.controlPanelOutlet}>
      {panels.map((p) => {
        return (
          <button
            key={p.id}
            className={`${c.action} cursor-pointer w-full flex items-center`}
            onClick={() =>
              dispatch('replace', {
                at: path,
                with: p.empty(),
              })
            }
          >
            {<p.Icon size={'var(--icon-m)'} />} <span className="p-s">{p.Name()}</span>
          </button>
        );
      })}

      {panels.length === 0 && <div className="p-s">No blocks found</div>}
    </div>
  );
};
