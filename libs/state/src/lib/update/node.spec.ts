import { editorReducerFactory } from '../reducer';
import { ControlNodeDescription, RootNodeDescription } from '@image-blog/shared';

describe('create new node at the end of the root in a flat tree', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const reducer = editorReducerFactory([RootNodeDescription, ControlNodeDescription]);
});
