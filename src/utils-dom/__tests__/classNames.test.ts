import { classNames } from '../classNames';

describe('className test', () => {
  it('should return all args', () => {
    expect(classNames('all', 'my', 'classnames')).toBe('all my classnames');
  });

  it('should remove falsy values', () => {
    expect(classNames('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });

  it('should flat arrays', () => {
    expect(classNames('foo', ['array', 'class'], 'bar')).toBe(
      'foo array class bar',
    );
  });

  it('should trim', () => {
    expect(classNames('foo ', '  ', ' bar ')).toBe('foo bar');
  });

  it('should apply classname conditionnaly', () => {
    expect(classNames({ foo: true, no: false }, true && 'bar')).toBe('foo bar');
  });

  it('should return class with mix values', () => {
    expect(
      classNames('foo', ['array', 'values'], true && 'bar', false && 'no', {
        null: null,
        undefined: undefined,
      }),
    ).toBe('foo array values bar');
  });
});
