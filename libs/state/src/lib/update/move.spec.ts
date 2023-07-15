import { editorReducerFactory } from '../reducer';
import {
  ColumnNodeDescription,
  ColumnNodeOutletDescription,
  ControlNodeDescription,
  DividerNodeDescription,
  ImageNodeDescription,
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
    ImageNodeDescription,
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

  test('Move two block outside of a 2 deep nested node - bottom to top selection', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }, { id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 2],
      outerFocusedRange: -1,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0, 1, 2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'divider' },
        { id: 'divider' },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    });
  });

  test('Move two block outside of a 2 deep nested node - top to bottom selection', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }, { id: 'divider' }, { id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 1],
      outerFocusedRange: 1,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [0, 1, 2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'divider' },
        { id: 'divider' },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 1,
      forceFocus: false,
    });
  });

  test('Move nested element', () => {
    const state0 = {
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-up', origin: [1], payload: null });
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
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-down', origin: [0], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [{ id: 'control', children: [] }],
            },
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });
  test('move deeply nested element down', () => {
    const state0 = {
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [1], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 0, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-down', origin: [1, 0, 0], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 0, 1],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state3 = reducer(state2, { type: 'move-outer-focused-down', origin: [1, 0, 1], payload: null });
    expect(state3).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 1, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state4 = reducer(state3, { type: 'move-outer-focused-down', origin: [1, 1, 0], payload: null });
    expect(state4).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 1, 1],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state5 = reducer(state4, { type: 'move-outer-focused-down', origin: [1, 1, 1], payload: null });
    expect(state5).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('move deeply nested list up', () => {
    const state0 = {
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-up', origin: [2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 1, 1],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-up', origin: [1, 1, 1], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 1, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state3 = reducer(state2, { type: 'move-outer-focused-up', origin: [1, 1, 0], payload: null });
    expect(state3).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 0, 1],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state4 = reducer(state3, { type: 'move-outer-focused-up', origin: [1, 0, 1], payload: null });
    expect(state4).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 0, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state5 = reducer(state4, { type: 'move-outer-focused-up', origin: [1, 0, 0], payload: null });
    expect(state5).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('move multiple deeply nested up - bottom to top selection', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -6,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-up', origin: [2], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 2],
      outerFocusedRange: -6,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-up', origin: [0, 1, 2], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 1],
      outerFocusedRange: -6,
      forceFocus: false,
    });

    const state3 = reducer(state2, { type: 'move-outer-focused-up', origin: [0, 1, 0, 1], payload: null });
    expect(state3).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 2],
      outerFocusedRange: -6,
      forceFocus: false,
    });

    const state4 = reducer(state3, { type: 'move-outer-focused-up', origin: [0, 0, 2], payload: null });
    expect(state4).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 1],
      outerFocusedRange: -6,
      forceFocus: false,
    });

    const state5 = reducer(state4, { type: 'move-outer-focused-up', origin: [0, 0, 0, 1], payload: null });
    expect(state5).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
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
      outerFocusedRange: -6,
      forceFocus: false,
    });
  });

  test('move multiple deeply nested down - top to bottom selection', () => {
    const state0 = {
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
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
      outerFocusedRange: 6,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'move-outer-focused-down', origin: [1], payload: null });
    expect(state1).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 0],
      outerFocusedRange: 6,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'move-outer-focused-down', origin: [0, 0, 0, 1], payload: null });
    expect(state2).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 0, 1],
      outerFocusedRange: 6,
      forceFocus: false,
    });

    const state3 = reducer(state2, { type: 'move-outer-focused-down', origin: [0, 0, 1, 0, 1], payload: null });
    expect(state3).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
                { id: 'control', children: [] },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 0],
      outerFocusedRange: 6,
      forceFocus: false,
    });

    const state4 = reducer(state3, { type: 'move-outer-focused-down', origin: [0, 1, 1], payload: null });
    expect(state4).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            {
              id: 'column-outlet',
              children: [
                { id: 'control', children: [] },
                {
                  id: 'column',
                  children: [
                    { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
                    { id: 'column-outlet', children: [{ id: 'divider' }] },
                  ],
                  data: { lWidth: '50%' },
                },
                {
                  id: 'column',
                  children: [
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                    {
                      id: 'column-outlet',
                      children: [
                        {
                          id: 'image',
                          data: {
                            src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                            caption: '',
                            width: '50%',
                          },
                        },
                      ],
                    },
                  ],
                  data: { lWidth: '50%' },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [0, 1, 1],
      outerFocusedRange: 6,
      forceFocus: false,
    });

    const state5 = reducer(state4, { type: 'move-outer-focused-down', origin: [0, 1, 1, 0, 1], payload: null });
    expect(state5).toEqual({
      id: 'root',
      children: [
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            { id: 'column-outlet', children: [{ id: 'divider' }, { id: 'divider' }] },
            { id: 'column-outlet', children: [{ id: 'divider' }] },
          ],
          data: { lWidth: '50%' },
        },
        {
          id: 'column',
          children: [
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
            {
              id: 'column-outlet',
              children: [
                {
                  id: 'image',
                  data: {
                    src: "data:image/svg+xml,%3Csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='none' d='M0 0h24v24H0z'%3E%3C/path%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'%3E%3C/path%3E%3C/svg%3E",
                    caption: '',
                    width: '50%',
                  },
                },
              ],
            },
          ],
          data: { lWidth: '50%' },
        },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 6,
      forceFocus: false,
    });
  });
});
