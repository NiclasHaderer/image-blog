import { FC, ReactNode, useRef } from 'react';
import { useOnEditorUpdate } from '../state-holder';
import { useShortcut } from '../keyboard-event';
import { EditorActions } from '@image-blog/state';
import { RootNodeProps } from '@image-blog/shared';

type StateTransition = {
  startState: RootNodeProps;
  endState: RootNodeProps;
  action: EditorActions;
};

const generateJestTest = async (stateTransitions: StateTransition[]) => {
  const assertions = stateTransitions.map((transition, index) => {
    return `
    ${index === 0 ? `const state${index} = ${JSON.stringify(transition.startState)};` : ''}
    const state${index + 1} = reducer(state${index}, ${JSON.stringify(transition.action)});
    expect(state${index + 1}).toEqual(${JSON.stringify(transition.endState)});
    `;
  });

  const test = `
  test("TODO: name", () => {
    ${assertions.join('\n')}
  });
  `;

  // copy test to clipboard
  await window.navigator.clipboard.writeText(test);
};

export const TestGenerator: FC<{
  startHotkey?: string;
  endHotkey?: string;
  children?: ReactNode;
  generateTest?: (stateTransitions: StateTransition[]) => void | Promise<void>;
}> = ({ startHotkey = 'mod+alt+s', endHotkey = 'mod+alt+e', children, generateTest = generateJestTest }) => {
  const stateTransitions = useRef<StateTransition[]>([]);

  const startRecording = useRef(false);

  useShortcut(startHotkey, typeof window === 'undefined' ? null : (window as Window), () => {
    startRecording.current = true;
  });

  useOnEditorUpdate((oldState, newState, action) => {
    if (!startRecording.current) return;

    stateTransitions.current.push({
      startState: oldState,
      endState: newState,
      action: action,
    });
  });

  useShortcut(endHotkey, typeof window === 'undefined' ? null : (window as Window), async () => {
    startRecording.current = false;
    await generateTest(stateTransitions.current);
    stateTransitions.current = [];
  });

  return <>{children}</>;
};
