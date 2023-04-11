import c from './control-node.module.scss';
import { FC, useEffect, useRef, useState } from 'react';
import { useFocusTrap, useTabModifier } from '../../hooks/tap-focus';
import { EditorNode } from './editor-node';
import { NodeProps, useIsFocused, useNodeIndex, useUpdateEditor } from '../state/editor-state';
import { useNodeQuery } from './nodes';
import { useGlobalEvent } from '../../hooks/global-events';

export type ControlNodeProps = NodeProps;

export class ControlNode extends EditorNode<ControlNodeProps> {
  constructor() {
    super(
      'control-node',
      {
        canBeDeleted: true,
        canBeInnerFocused: true,
        structural: false,
      },
      []
    );
  }

  Name = () => 'Controls';

  Icon = () => null;

  Render = () => {
    const controlInput = useRef<HTMLInputElement>(null);
    const outerDiv = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState<string>();
    const [isClosed, setIsClosed] = useState(true);
    const dispatch = useUpdateEditor();
    const path = useNodeIndex();
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
        className={c.controlNodeWrapper}
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
              // Do not propagate, as we only want to close the node
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
              dispatch('add', { at: path, node: ControlNode.empty() });
              dispatch('focus-next', { force: true });
            }
          }}
          contentEditable={true}
          data-empty-text="Search for blocks"
          onInput={(e) => setSearch(e.currentTarget.value)}
          className="w-full p-1 bg-transparent"
        ></input>
        {shouldShow() && <ControlOutlet search={search ?? ''} />}
      </div>
    );
  };

  empty(): ControlNodeProps {
    return ControlNode.empty();
  }

  static empty(): ControlNodeProps {
    return {
      id: 'control-node',
      data: undefined,
    };
  }
}

const ControlOutlet: FC<{ search: string }> = ({ search }) => {
  const dispatch = useUpdateEditor();
  const path = useNodeIndex();
  const nodes = useNodeQuery(search);
  return (
    <div className={c.controlNodeOutlet}>
      {nodes.map((p) => {
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

      {nodes.length === 0 && <div className="p-s">No blocks found</div>}
    </div>
  );
};
