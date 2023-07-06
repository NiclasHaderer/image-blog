import { editorReducerFactory } from '../reducer';
import { ControlNodeDescription, RootNodeDescription } from '@image-blog/shared';

describe('create new node at the end of the root in a flat tree', () => {
  const reducer = editorReducerFactory([RootNodeDescription, ControlNodeDescription]);

  test('Add new nodes', () => {
    const state0 = {
      id: 'root',
      children: [{ id: 'control', children: [] }],
      focusedNode: [0],
      outerFocusedNode: null,
      outerFocusedRange: 0,
      forceFocus: true,
    };
    const state1 = reducer(state0, {
      type: 'add',
      origin: [0],
      payload: { at: [0], node: { id: 'control', children: [] } },
    });
    expect(state1).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        { id: 'control', children: [] },
      ],
      focusedNode: [0],
      outerFocusedNode: null,
      outerFocusedRange: 0,
      forceFocus: true,
    });

    const state2 = reducer(state1, { type: 'focus-next', origin: [0], payload: { force: true } });
    expect(state2).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        { id: 'control', children: [] },
      ],
      focusedNode: [1],
      outerFocusedNode: null,
      outerFocusedRange: 0,
      forceFocus: true,
    });

    const state3 = reducer(state2, {
      type: 'add',
      origin: [1],
      payload: { at: [1], node: { id: 'control', children: [] } },
    });
    expect(state3).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        { id: 'control', children: [] },
        { id: 'control', children: [] },
      ],
      focusedNode: [1],
      outerFocusedNode: null,
      outerFocusedRange: 0,
      forceFocus: true,
    });

    const state4 = reducer(state3, { type: 'focus-next', origin: [1], payload: { force: true } });
    expect(state4).toEqual({
      id: 'root',
      children: [
        { id: 'control', children: [] },
        { id: 'control', children: [] },
        { id: 'control', children: [] },
      ],
      focusedNode: [2],
      outerFocusedNode: null,
      outerFocusedRange: 0,
      forceFocus: true,
    });
  });
});
