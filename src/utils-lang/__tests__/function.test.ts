import { isFunction } from '../function';

describe('Lang function utils tests', () => {
  it('should be a function', () => {
    const fn = () => {};
    expect(isFunction(fn)).toBe(true);
  });
  it('should not be a function', () => {
    const object = {};
    expect(isFunction(object)).toBe(false);
  });
});
