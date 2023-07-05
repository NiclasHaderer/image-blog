import { ControlNodeDescription, DividerNodeDescription, RootNodeDescription, RootNodeProps } from '@image-blog/shared';
import { editorReducerFactory } from '../reducer';

describe('Flat list', () => {
  test('Test moving up with single selection', () => {
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
      data: undefined,
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    };

    const newState = editorReducerFactory([RootNodeDescription, ControlNodeDescription, DividerNodeDescription])(
      originalState,
      {
        type: 'move-outer-focused-up',
        payload: null,
        origin: [],
      }
    );
    expect(newState).toEqual({
      children: [
        {
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
          data: undefined,
          focusedNode: null,
          outerFocusedNode: [2],
          outerFocusedRange: 0,
          forceFocus: false,
        },
      ],
      id: 'root',
      data: undefined,
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
    });
  });
});
