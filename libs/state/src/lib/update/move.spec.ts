import { editorReducerFactory } from '../reducer';
import { ControlNodeDescription, DividerNodeDescription, RootNodeProps } from '@image-blog/shared';

describe('Flat list', () => {
  test('Test moving up of multiple blocks', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'control',
          data: undefined,
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    };

    const newState = editorReducerFactory([ControlNodeDescription, DividerNodeDescription])(originalState, {
      type: 'move-outer-focused-up',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
        {
          id: 'control',
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: -1,
      forceFocus: false,
    });
  });

  test('Test moving up of one block', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'control',
          data: undefined,
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const newState = editorReducerFactory([ControlNodeDescription, DividerNodeDescription])(originalState, {
      type: 'move-outer-focused-up',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Test moving down of multiple blocks', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'control',
          data: undefined,
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    };

    const newState = editorReducerFactory([ControlNodeDescription, DividerNodeDescription])(originalState, {
      type: 'move-outer-focused-down',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'control',
        },
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
      data: {},
      focusedNode: null,
      outerFocusedNode: [3],
      outerFocusedRange: -1,
      forceFocus: false,
    });
  });

  test('Test moving down one block', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'divider',
          data: undefined,
        },
        {
          id: 'control',
          data: undefined,
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const newState = editorReducerFactory([ControlNodeDescription, DividerNodeDescription])(originalState, {
      type: 'move-outer-focused-down',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
        {
          id: 'divider',
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [3],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });
});
