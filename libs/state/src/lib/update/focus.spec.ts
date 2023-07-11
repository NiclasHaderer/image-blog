import {
  ColumnNodeDescription,
  ColumnNodeOutletDescription,
  ControlNodeDescription,
  DividerNodeDescription,
  RootNodeDescription,
  RootNodeProps,
} from '@image-blog/shared';
import { editorReducerFactory } from '../reducer';

describe('Flat list', () => {
  const reducer = editorReducerFactory([
    RootNodeDescription,
    ControlNodeDescription,
    DividerNodeDescription,
    ColumnNodeDescription,
    ColumnNodeOutletDescription,
  ]);

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

    const newState = reducer(originalState, {
      type: 'outer-focus-previous',
      payload: {
        mode: 'replace',
      },
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

    const newState = reducer(originalState, {
      type: 'outer-focus-previous',
      payload: {
        mode: 'replace',
      },
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

describe('Nested list', () => {
  const reducer = editorReducerFactory([
    RootNodeDescription,
    ControlNodeDescription,
    DividerNodeDescription,
    ColumnNodeDescription,
    ColumnNodeOutletDescription,
  ]);

  test('test multiselect with structural nodes - up', () => {
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'outer-focus-previous', origin: [2], payload: { mode: 'add' } });
    expect(state1).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'outer-focus-previous', origin: [1, 1, 0], payload: { mode: 'add' } });
    expect(state2).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -3,
      forceFocus: false,
    });

    const state3 = reducer(state2, { type: 'outer-focus-previous', origin: [1, 1], payload: { mode: 'add' } });
    expect(state3).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -5,
      forceFocus: false,
    });
  });

  test('Go up through nested nodes', () => {
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'outer-focus-previous', origin: [2], payload: { mode: 'replace' } });
    expect(state1).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 1, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state2 = reducer(state1, { type: 'outer-focus-previous', origin: [1, 1, 0], payload: { mode: 'replace' } });
    expect(state2).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1, 0, 0],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state3 = reducer(state2, { type: 'outer-focus-previous', origin: [1, 0, 0], payload: { mode: 'replace' } });
    expect(state3).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
    });

    const state4 = reducer(state3, { type: 'outer-focus-previous', origin: [1], payload: { mode: 'replace' } });
    expect(state4).toEqual({
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
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });

  test('Go down through nested nodes', () => {
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
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
          ],
          data: { lWidth: '50%' },
        },
        { id: 'control', children: [] },
      ],
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
    };
    const state1 = reducer(state0, { type: 'outer-focus-next', origin: [0], payload: { mode: 'replace' } });
    expect(state1).toEqual({
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

    const state2 = reducer(state1, { type: 'outer-focus-next', origin: [1], payload: { mode: 'replace' } });
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

    const state3 = reducer(state2, {
      type: 'outer-focus-next',
      origin: [1, 0, 0],
      payload: { mode: 'replace' },
    });
    expect(state3).toEqual({
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
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
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

    const state4 = reducer(state3, {
      type: 'outer-focus-next',
      origin: [1, 1, 0],
      payload: { mode: 'replace' },
    });
    expect(state4).toEqual({
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
            { id: 'column-outlet', children: [{ id: 'control', children: [] }] },
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
});
