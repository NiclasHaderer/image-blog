import { ControlNodeDescription, DividerNodeDescription, RootNodeDescription, RootNodeProps } from '@image-blog/shared';
import { editorReducerFactory } from '../reducer';

describe('Flat list', () => {
  test('Test focus previous with single outer focus', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const newState = editorReducerFactory([RootNodeDescription, ControlNodeDescription, DividerNodeDescription])(
      originalState,
      {
        type: 'outer-focus-previous',
        payload: {
          mode: 'replace',
        },
        origin: [],
      }
    );
    expect(newState).toEqual({
      children: [
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Test focus previous with multiple outer focus', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    };

    const newState = editorReducerFactory([RootNodeDescription, ControlNodeDescription, DividerNodeDescription])(
      originalState,
      {
        type: 'outer-focus-previous',
        payload: {
          mode: 'replace',
        },
        origin: [],
      }
    );
    expect(newState).toEqual({
      children: [
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });
});
