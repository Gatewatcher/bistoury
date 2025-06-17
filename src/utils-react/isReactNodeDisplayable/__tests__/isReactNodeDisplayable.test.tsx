import { Fragment } from 'react';

import { isReactNodeDisplayable } from '..';

describe('isReactNodeDisplayable', () => {
  it.each([
    [false, false],
    [true, false],
    [null, false],
    [undefined, false],
    [0, true],
    ['test', true],
    [[], true],
    [<div key="div" />, true],
    [<Fragment key="fragment" />, true],
  ])('isReactNodeDisplayable(%s) -> %s', async (node, expected) => {
    expect(isReactNodeDisplayable(node)).toBe(expected);
  });
});
