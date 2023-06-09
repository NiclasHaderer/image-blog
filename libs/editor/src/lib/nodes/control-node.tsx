import c from './control-node.module.scss';
import { FC, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '../hooks/tap-focus';
import { AbstractNode } from './abstract-node';
import { NodeProps, useIsNodeInnerFocused, useNodeIndex, useUpdateEditor } from '../state/editor-state';
import { useNodeHandlersQuery } from './nodes';
import { useGlobalEvent } from '../hooks/global-events';

export type ControlNodeProps = NodeProps;

export class ControlNode extends AbstractNode<ControlNodeProps> {
  constructor() {
    super('control-node', []);
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
    const { isFocused, force } = useIsNodeInnerFocused();
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

    const { focusPrevious, focusNext } = useFocusTrap(outerDiv.current);
    return (
      <div
        className={c.controlNodeWrapper}
        ref={outerDiv}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' && shouldShow()) {
            focusPrevious();
          } else if (event.key === 'ArrowDown' && shouldShow()) {
            focusNext();
          } else if (event.key === 'Escape' && shouldShow()) {
            event.stopPropagation();
            setIsClosed(true);
          }
        }}
      >
        <input
          ref={controlInput}
          placeholder={'Search for blocks'}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !search) {
              e.stopPropagation();
              dispatch('delete', { at: path });
            } else if (e.key === 'Enter') {
              e.stopPropagation();
              setIsClosed(true);
              dispatch('add', { at: path, node: ControlNode.empty() });
              dispatch('focus-next', { force: true });
            } else if (e.key === 'ArrowUp' && !shouldShow()) {
              e.stopPropagation();
              dispatch('focus-previous', { force: true });
            } else if (e.key === 'ArrowDown' && !shouldShow()) {
              e.stopPropagation();
              dispatch('focus-next', { force: true });
            } else if (e.key.length === 1) {
              setIsClosed(false);
            }
          }}
          contentEditable={true}
          data-empty-text="Search for blocks"
          onInput={(e) => setSearch(e.currentTarget.value)}
          className="w-full p-1 bg-transparent"
        ></input>
        {shouldShow() && <ControlOutlet search={search ?? ''} onKeyDown={(e) => {}} />}
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
      capabilities: {
        canBeDeleted: true,
        canBeInnerFocused: true,
        canHaveChildren: false,
        structural: false,
      },
    };
  }
}

const ControlOutlet: FC<{ search: string; onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void }> = ({
  search,
  onKeyDown,
}) => {
  const dispatch = useUpdateEditor();
  const path = useNodeIndex();
  const nodes = useNodeHandlersQuery(search);
  return (
    <div className={c.controlNodeOutlet} onKeyDown={onKeyDown}>
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
