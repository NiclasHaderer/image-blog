import { editorReducerFactory } from '../reducer';
import {
  ColumnNodeDescription,
  ColumnNodeOutletDescription,
  ControlNodeDescription,
  DividerNodeDescription,
  RootNodeDescription,
  RootNodeProps,
} from '@image-blog/shared';

describe('Flat list', () => {
  const reducer = editorReducerFactory([RootNodeDescription, ControlNodeDescription, DividerNodeDescription]);

  test('Cannot move the first node any more up', () => {
    const state0 = {
      id: 'root',
      children: [{ id: 'divider' }, { id: 'control', children: [] }, { id: 'control', children: [] }],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-up', origin: [0], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [{ id: 'divider' }, { id: 'control', children: [] }, { id: 'control', children: [] }],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Cannot move last node any more down', () => {
    const state0 = {
      id: 'root',
      children: [{ id: 'control', children: [] }, { id: 'control', children: [] }, { id: 'divider' }],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [{ id: 'control', children: [] }, { id: 'control', children: [] }, { id: 'divider' }],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Test moving up of multiple blocks', () => {
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
        {
          id: 'control',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    };

    const newState = reducer(originalState, {
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
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const newState = reducer(originalState, {
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
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    };

    const newState = reducer(originalState, {
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
        },
        {
          id: 'divider',
        },
        {
          id: 'divider',
        },
        {
          id: 'control',
        },
      ],
      id: 'root',
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const newState = reducer(originalState, {
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
      focusedNode: null,
      outerFocusedNode: [3],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });
});

describe('Nested list', () => {
  const reducer = editorReducerFactory([
    RootNodeDescription,
    ControlNodeDescription,
    ColumnNodeOutletDescription,
    ColumnNodeDescription,
    DividerNodeDescription,
  ]);

  test('Move one block into same nesting level, but different parent', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const state1 = reducer(state0, { type: 'move-outer-focused-up', origin: [0, 1, 0], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }, { id: 'divider' }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 1],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Move one block out of a deeper nesting level if the end of the deeper nesting level was reached', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 1],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0, 1, 1], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'divider' },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Move one block out of a deeper nesting level if the start of the deeper nesting level was reached', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'divider' }, { id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-up', origin: [0, 0, 0], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        { id: 'divider' },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Move node into more deeply nested structure', () => {
    const state0 = {
      id: 'root',
      children: [
        { id: 'divider' },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'divider' }, { id: 'control', children: [] }],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Move two blocks in and out of a nested list - top to bottom selection', () => {
    const state0 = {
      id: 'root',
      children: [
        { id: 'divider' },
        { id: 'divider' },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 1,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [1], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }, { id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 0],
      outerFocusedRange: 1,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-up', origin: [0, 0, 1], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        { id: 'divider' },
        { id: 'divider' },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 1,
      forceFocus: false,
    });
  });

  test('Move two blocks in and out of a nested list - bottom to top selection', () => {
    const state0 = {
      id: 'root',
      children: [
        { id: 'divider' },
        { id: 'divider' },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: -1,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }, { id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 1],
      outerFocusedRange: -1,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-up', origin: [0, 0, 1], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        { id: 'divider' },
        { id: 'divider' },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: -1,
      forceFocus: false,
    });
  });

  test('Move two blocks from one child into another child - top to bottom selection', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 1],
      outerFocusedRange: 1,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0, 0, 2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }, { id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 0],
      outerFocusedRange: 1,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-up', origin: [0, 1, 1], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 1],
      outerFocusedRange: 1,
      forceFocus: false,
    });
  });

  test('Move two blocks from one child into another child - bottom to top selection', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 2],
      outerFocusedRange: -1,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0, 0, 2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }, { id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 1],
      outerFocusedRange: -1,
      forceFocus: false,
    });
    const state2 = reducer(state1, { type: 'move-outer-focused-up', origin: [0, 1, 0], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 2],
      outerFocusedRange: -1,
      forceFocus: false,
    });
  });

  // TODO move two blocks from one child into another child - bottom to top selection
});
