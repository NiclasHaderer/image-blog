import { editorReducer } from '../reducer';
import { RootNodeProps } from '@image-blog/shared';

describe('Flat list', () => {
  test('Test moving up of multiple blocks', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    };

    const newState = editorReducer(originalState, {
      type: 'move-outer-focused-up',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: -1,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    });
  });

  test('Test moving up of one block', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [1],
      outerFocusedRange: 0,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    };

    const newState = editorReducer(originalState, {
      type: 'move-outer-focused-up',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [0],
      outerFocusedRange: 0,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    });
  });

  test('Test moving down of multiple blocks', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: -1,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    };

    const newState = editorReducer(originalState, {
      type: 'move-outer-focused-down',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [3],
      outerFocusedRange: -1,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    });
  });

  test('Test moving down one block', () => {
    const originalState: RootNodeProps = {
      children: [
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'divider',
          data: undefined,
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          data: undefined,
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [2],
      outerFocusedRange: 0,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    };

    const newState = editorReducer(originalState, {
      type: 'move-outer-focused-down',
      payload: null,
      origin: [],
    });

    expect(newState).toEqual({
      children: [
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
        {
          id: 'control',
          capabilities: { canBeDeleted: true, canBeInnerFocused: true, canHaveChildren: false, structural: false },
        },
        {
          id: 'divider',
          capabilities: { canBeDeleted: true, canHaveChildren: false, canBeInnerFocused: false, structural: false },
        },
      ],
      id: 'root',
      data: {},
      focusedNode: null,
      outerFocusedNode: [3],
      outerFocusedRange: 0,
      forceFocus: false,
      capabilities: {
        canBeDeleted: false,
        structural: true,
        immutableChildren: false,
        canHaveChildren: true,
        maxChildren: Infinity,
        minChildren: 1,
        canBeInnerFocused: false,
      },
    });
  });
});
