import { isChildOf, isParentOf } from './utils';

test('Is child of', () => {
  expect(isChildOf([1, 2], [1, 2, 3])).toEqual(false);
  expect(isChildOf([1, 2, 3], [1, 2, 3])).toEqual(false);
  expect(isChildOf([1, 2, 4, 5], [1, 2, 3])).toEqual(false);
  expect(isChildOf([1, 2, 4, 5], [1])).toEqual(true);
  expect(isChildOf([1, 3, 0, 0], [1, 3])).toEqual(true);
});

test('Is parent of', () => {
  expect(isParentOf([1, 2], [1, 2, 3])).toEqual(true);
  expect(isParentOf([1, 2, 3], [1, 2, 3])).toEqual(false);
  expect(isParentOf([1, 2, 4, 5], [1, 2, 3])).toEqual(false);
  expect(isParentOf([1, 2, 4, 5], [1])).toEqual(false);
  expect(isParentOf([1, 3, 0, 0], [1, 3])).toEqual(false);
});
