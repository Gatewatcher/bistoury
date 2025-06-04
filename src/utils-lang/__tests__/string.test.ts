import { camelcase, isString, pascalCase } from '../string';

describe('Lang string utils tests', () => {
  it('should be a string and be true', () => {
    const str = 'my string';
    expect(isString(str)).toBe(true);
  });

  it('should render an error', () => {
    const number = 2;
    expect(isString(number)).toBe(false);
  });

  it('should camelCase strings', () => {
    const string1 = 'my string';
    expect(camelcase(string1)).toBe('myString');

    const string2 = 'with 2 numbers 2';
    expect(camelcase(string2)).toBe('with2Numbers2');

    const string3 = 'test-with-%-strange char';
    expect(camelcase(string3)).toBe('testWithStrangeChar');

    const string4 = 'test.point';
    expect(camelcase(string4)).toBe('testPoint');

    const string5 = 'myString';
    expect(camelcase(string5)).toBe('myString');

    const string6 = 'MyString';
    expect(camelcase(string6)).toBe('myString');
  });

  it('should pascalCase strings', () => {
    const string1 = 'my string';
    expect(pascalCase(string1)).toBe('MyString');

    const string2 = 'with 2 numbers 2';
    expect(pascalCase(string2)).toBe('With2Numbers2');

    const string3 = 'test-with-%-strange char';
    expect(pascalCase(string3)).toBe('TestWithStrangeChar');

    const string4 = 'test.point';
    expect(pascalCase(string4)).toBe('TestPoint');
  });
});
